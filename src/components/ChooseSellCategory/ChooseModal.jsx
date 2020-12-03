import React from 'react';
import { getSellCategoryData } from '@/services/sellCategory';
import { Modal, Tag } from 'antd';
import styles from './index.less';

class ChooseSellCategory extends React.Component {
  state = {
    list: [],
    selected: [],
  };

  componentDidMount() {
    this.load();
  }

  load = async () => {
    const { list } = await getSellCategoryData();

    this.props.categoryIds.reverse().forEach((id) => {
      const index = list.findIndex((item) => String(item.id) === String(id));
      if (index !== -1) {
        list[index].status = '1';
        list.unshift(list.splice(index, 1)[0]);
      }
    });
    this.setState({ list });
  };

  setClassName = (status) => {
    // status  '':蓝色 可选 | '1': 已经选了 灰色禁用 | '2': 紫色禁用 要添加的
    if (!status) return styles.canSelect;
    if (status === '1') return styles.cantSelect;
    if (status === '2') return styles.wantSelected;
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
    if (item.status) return;
    const { selected, list } = this.state;

    const index = list.findIndex((i) => String(i.id) === String(item.id));
    list[index].status = '2';

    this.setState({ selected: [...new Set([...selected, item])], list });
  }

  handleDelete(item, index) {
    const { selected, list } = this.state;

    const listIndex = list.findIndex((i) => String(i.id) === String(item.id));
    list[listIndex].status = '';

    selected.splice(index, 1);
    this.setState({ selected: [...selected], list });
  }

  render() {
    const { onClose } = this.props;
    const { selected, list } = this.state;
    return (
      <Modal onOk={this.handleSubmit} onCancel={onClose} visible title="选择销售分类">
        <div>
          <div className={`mb10 `}>销售分类列表：</div>
          <div className={`"min-h40 `}>
            {list.length
              ? list.map((item, index) => (
                  <div key={item.id} className={this.setClassName(item.status)}>
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
          <div className="mb10">当前准备添加销售分类为：</div>
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

export default ChooseSellCategory;
