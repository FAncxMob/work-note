import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import { Tag, Modal, Dropdown, Menu } from 'antd';
import routeMap from '@/routeMap';
import UFF from '@/utils/UFF';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { StatusChangeModalConfig } from './components/ModalConfig.jsx';
import VerifyModal from './components/VerifyModal/index.jsx';

const Columns = (props) => {
  const { verifyStatus, hostStatus, dispatch, loadTableList } = props;

  const menu1 = ({ captainId = '', status }) => {
    let arr = [
      {
        text: '审核',
        onClick: () => VerifyModal({ captainId, reLoad: loadTableList, dispatch }),
      },
      {
        text: '明细',
        onClick: () => history.push(`${routeMap.captainDetail}?id=${captainId}`),
      },
      {
        text: '编辑',
        onClick: () => history.push(`${routeMap.captainEdit}?id=${captainId}`),
      },
      {
        text: '歇业',
        onClick: () =>
          Modal.confirm(
            StatusChangeModalConfig({ captainId, status: 0, dispatch, reLoad: loadTableList }),
          ),
      },
      {
        text: '禁用',
        onClick: () =>
          Modal.confirm(
            StatusChangeModalConfig({ captainId, status: 1, dispatch, reLoad: loadTableList }),
          ),
      },
      {
        text: '上线',
        onClick: () =>
          Modal.confirm(
            StatusChangeModalConfig({ captainId, status: 2, dispatch, reLoad: loadTableList }),
          ),
      },
      {
        text: '启用',
        onClick: () =>
          Modal.confirm(
            StatusChangeModalConfig({ captainId, status: 3, dispatch, reLoad: loadTableList }),
          ),
      },
    ];
    status = String(status);
    switch (status) {
      case '0':
        arr = [arr[0], arr[1], arr[2]];
        break;
      case '1':
        arr = [arr[3], arr[4], arr[1], arr[2]];
        break;
      case '2':
        arr = [arr[1], arr[2]];
        break;
      case '3':
        arr = [arr[6], arr[1], arr[2]];
        break;
      case '4':
        arr = [arr[5], arr[4], arr[1], arr[2]];
        break;
      default:
        break;
    }
    return (
      <Menu>
        {arr.map((item, index) => {
          return (
            <Menu.Item onClick={() => item.onClick()} className="w70 text-center" key={index}>
              <span>{item.text}</span>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };
  const menu2 = (record) => {
    const arr = [
      {
        text: '团长佣金',
        onClick: () => history.push(`${routeMap.captainStatics}?id=${record.captainId}`),
      },
    ];
    return (
      <Menu>
        {arr.map((item, index) => {
          return (
            <Menu.Item key={index}>
              <span onClick={() => item.onClick()}>{item.text}</span>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  return [
    {
      key: 'captainId',
      title: '团长编码',
      dataIndex: 'captainId',
      align: 'center',
      width: 80,
    },
    {
      title: '团长姓名',
      dataIndex: 'contactName',
      align: 'center',
      width: 120,
    },
    {
      title: '团长电话',
      dataIndex: 'contactMobile',
      align: 'center',
      width: 60,
    },
    {
      title: '自提点名称',
      dataIndex: 'name',
      align: 'center',
      width: 80,
    },
    {
      title: '自提点类型',
      align: 'center',
      width: 120,
      render: ({ typeName }) => {
        return <span>{typeName || '全部'}</span>;
      },
    },
    {
      title: '收货地址',
      align: 'center',
      width: 120,
      render: ({ province, city, area, communityAddress, detail }) => {
        return <span>{province + city + area + communityAddress + detail}</span>;
      },
    },
    {
      title: '状态',
      align: 'center',
      width: 70,
      render: ({ status }) => {
        const current = verifyStatus.find((item) => String(item.value) === String(status));
        if (current) return <Tag color={current.color}>{current.text}</Tag>;
        return '--';
      },
    },
    {
      title: '主体认证',
      align: 'center',
      width: 50,
      render: ({ authStatus }) => {
        const current = hostStatus.find((item) => String(item.value) === String(authStatus));
        if (current) return <Tag color={current.color}>{current.text}</Tag>;
        return '--';
      },
    },

    {
      title: '创建时间',
      align: 'center',
      width: 100,
      render: ({ createTime }) => `${moment(createTime).format('YYYY-MM-DD HH:mm')}`,
    },
    // {
    //   title: '上线时间',
    //   align: 'center',
    //   width: 80,
    //   render: ({ status, auditTime }) =>
    //     `${String(status) === '1' ? moment(auditTime).format('YYYY-MM-DD HH:mm') : '--'}`,
    // },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (record) => {
        return (
          <>
            <Dropdown className="mr20" overlay={menu1(record)}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                操作
                <DownOutlined />
              </a>
            </Dropdown>
            <Dropdown overlay={menu2(record)}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                数据
                <DownOutlined />
              </a>
            </Dropdown>
          </>
        );
      },
    },
  ];
};

export default Columns;
