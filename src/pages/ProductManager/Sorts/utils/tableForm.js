import React from 'react';
import { Button, Tag, Tooltip } from 'antd';

import { openStatus, _openStatus } from './utils';

const openStatusMap = [...openStatus];
openStatusMap.unshift({ value: '', label: '全部', color: '' });
// table栏的title
export const columns = (btnGroup) => {
  return [
    {
      key: '0',
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      width: 100,
      render: (id) => (
        <>
          <span>{id}</span>
        </>
      ),
    },
    {
      title: '分类名称',
      width: 160,
      key: '11',
      dataIndex: 'name',
      align: 'center',
      render: (val) => {
        const len = val.length > 10 ? '......' : '';
        return (
          <>
            <span>{val.slice(0, 10) + len}</span>
          </>
        );
      },
    },
    // {
    //   title: '状态',
    //   align: 'center',
    //   key: '5',
    //   dataIndex: 'deliveryType',
    //   width: 80,
    //   render: (val) => {
    //     const current = openStatusMap.find((item) => item.value === val);
    //     return current ? <Tag color={current.color}>{_openStatus(val)}</Tag> : '--';
    //   },
    // },
    {
      title: '操作',
      key: '10',
      align: 'center',
      fixed: 'right',
      width: 45,
      render: (data) => {
        return btnGroup(data);
      },
    },
  ];
};

// 头部数据筛选表单
export const formList = () => {
  return [
    {
      type: 'input',
      name: 'name',
      label: '分类名称',
      elOptions: {
        allowClear: true,
        placeholder: '请输入分类名称',
      },
      formItemOption: {
        className: 'mb10',
      },
    },
    // {
    //   type: 'radio',
    //   name: 'status',
    //   label: '状态',
    //   elOptions: {
    //     options: openStatusMap,
    //     optionType: 'button',
    //     buttonStyle: 'solid',
    //     size: 'middle',
    //   },
    // }
  ];
};
