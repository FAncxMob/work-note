import React from 'react';
import { Tag, Button, Tooltip } from 'antd';
import timeFormat from '@/utils/timefomart';
import { refundStatus } from '../../../utils';
import { type } from '../../../init';

// table栏的title
export const columns = (btnGroup, checkDetail) => {
  return [
    {
      key: '0',
      title: '售后编号',
      align: 'center',
      width: 86,
      render: (data) => {
        return (
          <Tooltip title="查看售后单详情">
            <span
              className="cup text-primary"
              type="link"
              onClick={() => {
                checkDetail(data);
              }}
            >
              {data.id}
            </span>
          </Tooltip>
        );
      },
    },
    {
      key: '1',
      title: '订单编号',
      align: 'center',
      dataIndex: 'orderId',
      width: 86,
      render: (id) => (
        <>
          <span>{id}</span>
        </>
      ),
    },
    {
      key: '2',
      title: '退款金额(元)',
      align: 'center',
      dataIndex: 'refundAmount',
      width: 96,
      render: (val) => (
        <>
          <span>{val}</span>
        </>
      ),
    },
    {
      key: '3',
      title: '退款原因',
      align: 'center',
      dataIndex: 'reason',
      width: 80,
      render: (val) => (
        <>
          <span>{val || ''}</span>
        </>
      ),
    },
    {
      key: '4',
      title: '订单类型',
      align: 'center',
      dataIndex: 'deliveryType',
      width: 82,
      render: (val) => {
        const { value, color } = type[val] || {};
        if (value)
          return (
            <>
              <Tag color={color}>{value}</Tag>
            </>
          );
        return '--';
      },
    },
    {
      key: '5',
      title: '用户信息',
      align: 'center',
      width: 110,
      render: ({ nickname, mobile }) => {
        return (
          <>
            <p className="mb5">{nickname || '--'}</p>
            <p className="mb0">{mobile || '--'}</p>
          </>
        );
      },
    },
    {
      key: '99',
      title: '订单状态',
      align: 'center',
      width: 86,
      render: ({ refundStatus: status, refundType }) => {
        const { value, color } = refundStatus(status, refundType);
        if (value) {
          return <Tag color={color}>{value}</Tag>;
        }
        return '--';
      },
    },
    {
      title: '下单时间',
      width: 76,
      key: '98',
      dataIndex: 'createTime',
      align: 'center',
      render: (val) => {
        return (
          <>
            <span>{timeFormat(val)}</span>
          </>
        );
      },
    },
    {
      title: '申请时间',
      width: 76,
      key: '87',
      dataIndex: 'paidTime',
      align: 'center',
      render: (val) => {
        return (
          <>
            <span>{timeFormat(val)}</span>
          </>
        );
      },
    },
    {
      title: '操作',
      key: '100',
      align: 'center',
      fixed: 'right',
      width: 175,
      render: (data) => {
        if (data.refundStatus === 1) return btnGroup(data);
        return '--';
      },
    },
  ];
};
