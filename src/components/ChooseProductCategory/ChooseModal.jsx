import React from 'react';
import { getBaseCategoryList } from '@/services/goodsWarehouse';
import { Modal, Tag } from 'antd';
import styles from './index.less';

class ChooseProductCategory extends React.Component {
  state = {
    list: [],
    selected: [],
  };

  componentDidMount() {
    this.load();
  }

  load = async () => {
    const list = await getBaseCategoryList();

    this.props.categoryIds.forEach((id) => {
      const index = list.findIndex((item) => String(item.id) === String(id));
      if (index !== -1) list[index].selected = '1';
    });
    this.setState({ list });
  };

  setClassName = (selected) => {
    // selected  '':蓝色 可选 | '1': 已经选了 灰色金庸 | '2': 紫色 要添加的
    if (!selected) return styles.canSelect;
    if (selected === '1') return styles.cantSelect;
    if (selected === '2') return styles.wantSelected;
    return 'dib';
  };

  handleSubmit = () => {
    const { onClose, callBack } = this.props;
    const { selected } = this.state;
    if (callBack) callBack(selected.map((item) => item.id));
    this.setState({ selected: [] });
    onClose();
  };

  handleSelect(item) {
    if (item.selected) return;
    const { selected, list } = this.state;

    const index = list.findIndex((i) => String(i.id) === String(item.id));
    list[index].selected = '2';

    this.setState({ selected: [...new Set([...selected, item])], list: [...list] });
  }

  handleDelete(item, index) {
    const { selected, list } = this.state;

    selected.splice(index, 1);
    const listIndex = list.findIndex((i) => String(i.id) === String(item.id));
    list[listIndex].selected = '';

    this.setState({ selected: [...selected], list });
  }

  render() {
    const { onClose } = this.props;
    const { selected, list } = this.state;
    return (
      <Modal onOk={this.handleSubmit} onCancel={onClose} visible title="选择商品分类">
        <div>
          <div className={`mb10 `}>商品分类列表：</div>
          <div className={`"min-h40 `}>
            {list.length
              ? list.map((item, index) => (
                  <div key={item.id} className={this.setClassName(item.selected)}>
                    <Tag
                      className="mb10"
                      onClick={() => this.handleSelect(item, index)}
                      color="blue"
                    >
                      {item.name}
                    </Tag>
                  </div>
                ))
              : null}
          </div>
        </div>
        <div>
          <div className="mb10">当前准备添加商品分类为：</div>
          <div className="min-h40">
            {selected.length
              ? selected.map((item, index) => (
                  <div key={item.id} className={styles.canSelect}>
                    <Tag
                      color="green"
                      className="mb10"
                      onClick={() => this.handleDelete(item, index)}
                    >
                      {item.name}
                    </Tag>
                  </div>
                ))
              : null}
          </div>
        </div>
      </Modal>
    );
  }
}

export default ChooseProductCategory;
