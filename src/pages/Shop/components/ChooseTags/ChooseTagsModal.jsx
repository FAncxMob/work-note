import React, { useEffect, useState } from 'react';
import { getTags } from '@/customizeModel/Shop/service';
import { Modal, Tag } from 'antd';
import shop from '@/customizeModel/Shop/Shop';
import styles from './index.less';

const ChooseClassModal = (props) => {
  const { onClose, classes = [], onSelect } = props;

  const [list, setList] = useState([]);
  const [selectClass, setSelectClass] = useState([]);
  const [formValues, setFormValues] = useState({
    name: '',
    // pageSize: DEFAULT_PAGESIZE,
    // currentPage: 1,
  });
  async function load(option) {
    try {
      const param = option || formValues;
      setFormValues({ ...formValues, ...param });

      const { includeShopCategoryIdArray } = await shop.getShopInfo();
      const { list } = await getTags({ includeShopCategoryIdArray });

      classes.forEach((name) => {
        const index = list.findIndex((item) => item.categoryTagName === name);
        if (index !== -1) list[index].selected = '1';
      });

      setSelectClass(classes);
      setList(list);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function setClassName(selected) {
    // selected  '':蓝色 可选 | '1': 已经选了 灰色金庸 | '2': 紫色 要添加的
    if (!selected) return styles.canSelect;
    if (selected === '1') return styles.cantSelect;
    if (selected === '2') return styles.wantSelected;
    return 'dib';
  }

  function handleSubmit() {
    setSelectClass([]);
    onSelect(selectClass);
    onClose();
  }

  function handleSelect(item, index) {
    list[index].selected = '1';
    setSelectClass((pre) => [...new Set([...pre, item.categoryTagName])]);
    setList(list);
  }

  function handleDelete(name, index) {
    selectClass.splice(index, 1);

    const listIndex = list.findIndex((i) => String(i.categoryTagName) === String(name));
    list[listIndex].selected = '';

    setSelectClass([...selectClass]);
    setList(list);
  }

  return (
    <Modal onOk={handleSubmit} onCancel={onClose} visible title="选择店铺标签">
      <div className={styles.listWrapper}>
        <div className="mb10 ">店铺标签列表：</div>
        <div className="min-h40">
          {list.length
            ? list.map((item, index) => (
                <div key={index} className={setClassName(item.selected)}>
                  <Tag className="mb10" onClick={() => handleSelect(item, index)} color="blue">
                    {item.categoryTagName}
                  </Tag>
                </div>
              ))
            : ''}
        </div>
      </div>
      <div>
        <div className="mb10">当前准备添加店铺标签为：</div>
        <div className="min-h40">
          {selectClass.length
            ? selectClass.map((name, index) => (
                <div key={index} className={styles.canSelect}>
                  <Tag color="green" className="mb10" onClick={() => handleDelete(name, index)}>
                    {name}
                  </Tag>
                </div>
              ))
            : null}
        </div>
      </div>
    </Modal>
  );
};

export default ChooseClassModal;
