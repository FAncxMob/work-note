import React from 'react';
import { Tag, Radio } from 'antd';
import { fundTypes, frozenTypes } from '@/models/wallet/utils';
import moment from 'moment';

function transformFenToYuan(fen) {
  if (isNaN(fen * 0.01) || fen < 0) return '0.00';
  return fen === 0 ? '0.00' : (fen / 100).toFixed(2);
}

export function columns1() {
  return [
    {
      title: '时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm') : '--'),
    },
    {
      key: 'id',
      title: '收入/支出',
      align: 'center',
      dataIndex: 'event',
      render: (val) => {
        const current = fundTypes(val);
        return <Tag color={current.color}>{current.type === 'in' ? '收入' : '支出'}</Tag>;
      },
    },
    {
      title: '类型',
      align: 'center',
      render: (row) => fundTypes(row.event, row.status).title,
    },
    {
      title: '订单/提现/退款编号',
      align: 'center',
      dataIndex: 'state',
    },
    {
      title: '说明',
      align: 'center',
      dataIndex: 'detail',
      render: (val) => val || '--',
    },
    {
      title: '金额（元）',
      align: 'center',
      render: (row) => {
        const current = fundTypes(row.event) || {};
        return (
          <div style={{ color: current.color }}>
            {current.type === 'in' ? '+' : '-'}
            {transformFenToYuan(row.amount)}
          </div>
        );
      },
    },
    // {
    //   title: '剩余佣金',
    //   align: 'center',
    //   dataIndex: 'a',
    // },
  ];
}
export function columns2() {
  return [
    {
      title: '时间',
      align: 'center',
      dataIndex: 'createTime',
      width: 250,
      render: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm') : '--'),
    },
    {
      title: '订单编号',
      align: 'center',
      dataIndex: 'state',
    },
    {
      key: 'type',
      title: '冻结原因',
      align: 'center',
      dataIndex: 'type',
      render: (val) => {
        const current = frozenTypes(val) || {};
        return current.title;
      },
    },
    {
      title: '冻结金额（元）',
      align: 'center',
      render: ({ amount }) => {
        return <p className="text-red"> {transformFenToYuan(amount)}</p>;
      },
    },
  ];
}
