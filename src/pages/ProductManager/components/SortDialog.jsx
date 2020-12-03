import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tag, Modal, Input } from 'antd';
import { CheckCircleOutlined, RedoOutlined } from '@ant-design/icons';

const ACTION = {
  getCommonList: 'sortsType/getCommonList',
  submitSort: 'sortsType/submitSort',
};

const SortDialog = (props) => {
  const {
    dispatch,
    sortsType: { sortTypeList },
    visible,
    isEdit,
  } = props;

  const [sortName, setSortName] = useState({ name: '' });
  const [confirmLoading, setConfirm] = useState(false);

  function changeSortTypeList() {
    dispatch({
      type: ACTION.getCommonList,
    });
  }
  function handleOk() {
    setConfirm(true);
    dispatch({
      type: ACTION.submitSort,
      payload: sortName,
      callback: () => {
        setConfirm(false);
      },
    });
  }

  function handleInputSort(e) {
    const obj = { name: e.target.value };
    if (sortName.id) obj.id = sortName.id;
    setSortName(obj);
  }
  const SelectingSort = () => {
    return (
      <div className="sort-select">
        <div className="df align-center">
          <p className="pt16 fx1 text-ellipsis fz14">大家还在用的</p>
          <div onClick={changeSortTypeList} className="cup">
            <RedoOutlined className="fz18 colorBlue" />
            <span className="fz14 ml5 colorBlue"> 换一批</span>
          </div>
        </div>
        {sortTypeList.map((item, index) => (
          <Tag
            color={item.id === sortName.id ? 'success' : 'processing'}
            icon={item.id !== sortName.id ? null : <CheckCircleOutlined />}
            key={index}
            className="mb5"
            onClick={() => {
              setSortName(item);
            }}
          >
            {item.name}
          </Tag>
        ))}
        {sortTypeList.length < 1 ? <span className="fz14 color999">没有更多数据了</span> : null}
      </div>
    );
  };
  return (
    <Modal
      title={isEdit ? '添加分类' : '编辑分类'}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => {
        props.setVisible(false);
      }}
    >
      <Input
        placeholder="请输入分类名"
        value={sortName.name}
        onChange={handleInputSort}
        allowClear
      />
      <SelectingSort />
    </Modal>
  );
};

export default connect(({ sortsType }) => ({
  sortsType,
}))(SortDialog);
