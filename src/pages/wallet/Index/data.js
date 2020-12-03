import React from 'react';
import { Tag, Radio } from 'antd';
import { fundTypes, frozenTypes } from '@/models/wallet/utils';
import moment from 'moment';

const typeMap = [
  { value: '', text: '全部' },
  { value: '0', text: '收入' },
  { value: '1', text: '支出' },
];

export function formList(detailType) {
  //  true 类型隐藏
  const arr = [
    {
      type: 'max31Date',
      name: 'time',
      label: '开始时间',
      elOptions: {
        placeholder: '请输入开始时间',
      },
    },
  ];
  const extra = [
    {
      type: 'select',
      name: 'type',
      label: '状态',
      width: 120,
      el: (
        <Radio.Group name="type" optionType="button">
          {typeMap.map((v) => (
            <Radio.Button key={v.value} value={v.value}>
              {v.text}
            </Radio.Button>
          ))}
        </Radio.Group>
      ),
    },
  ];

  return detailType === 'total' ? [...arr, ...extra] : [...arr];
}

export function totalColumns() {
  return [
    {
      key: 'event',
      title: '状态',
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
      width: 120,
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'detail',
    },
    {
      title: '变动时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm') : '--'),
    },
    {
      title: '增减',
      align: 'center',
      width: 120,
      render: (row) => {
        const current = fundTypes(row.event) || {};
        return (
          <div style={{ color: current.color }}>
            {current.type === 'in' ? '+' : '-'}
            {row.amountInYuan}
          </div>
        );
      },
    },
  ];
}

export function frozenColumns() {
  return [
    {
      title: '订单编号',
      align: 'center',
      dataIndex: 'state',
      width: 120,
    },
    {
      key: 'type',
      title: '冻结原因',
      align: 'center',
      dataIndex: 'type',
      render: (val) => {
        const current = frozenTypes(val) || {};
        return <div>{current.title}</div>;
      },
    },
    {
      title: '变动时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm') : '--'),
    },
    {
      title: '冻结金额',
      align: 'center',
      dataIndex: 'amountInYuan',
      width: 120,
      render: (val) => {
        return <p className="text-red">{val}</p>;
      },
    },
  ];
}
//  资产组成提醒  和冻结规则
export function popContent() {
  return (
    <div>
      <div>
        <div className="mb15">
          <span className="fwb">资产组成：</span>
          <p>
            1.总资产中包含可提现资金和冻结资金，冻结目的是用于售后风险资金，冻结周期为订单完结后48小时。
          </p>
        </div>
      </div>
      <div>
        <p className="fwb mb10">资金结算规则：</p>
        <p className="mb10">1.快递订单：T+3（T为顾客主动/系统自动确认收货时间）资金解冻</p>
        <p className="mb10">2.自提和配送订单：T+2（T为核销/确认送达时间）资金解冻</p>
        <p className="fwb mb10 mt15">系统自动确认收货规则：</p>
        <p className="mb10">
          1.订单发货后如顾客未主动确认收货，则系统会在T+5个自然日后自动确认收货
        </p>
        <p className="fwb">注：如订单正在售后中，则不可结算</p>
      </div>
    </div>
  );
}
// 提现规则
export function popWithdrawContent() {
  return (
    <div>
      <p className="mb10">
        1.提现至个人银行卡，每笔限额5万元，单日限额100万，每笔收取1元手续费（不足5万按5万收取1元/笔），单笔提现不低于5元
      </p>
      <p className="mb10">
        2.提现至对公账户，每笔限额50万元，不限次数，无单日限额，每笔收取10元手续费（不足50万按50万收取10元/笔），单笔提现不低于15元
      </p>
      <p>3.提现时，平台将收取提现金额千分之六的交易服务费</p>
    </div>
  );
}
