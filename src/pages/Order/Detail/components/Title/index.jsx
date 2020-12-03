import React from 'react';
import { history, connect } from 'umi';
import { Tag, Button } from 'antd';
import timeFormat from '@/utils/timefomart';
import { type } from '../../../init';

const Index = (props) => {
  const { id, orderId, deliveryType, createTime, refundAmount } = props.data;
  const { value, color } = type[deliveryType];
  // 是不是售后单
  const isRefundOrder = id && refundAmount >= 0;

  return (
    <div>
      {isRefundOrder ? <span className="mr15 fz16">售后编号：{id}</span> : null}
      <span className="mr15 fz16">订单号：{orderId}</span>
      <span className="mr15 fz16">
        {isRefundOrder ? '申请时间：' : '下单时间：'}
        {timeFormat(createTime)}
      </span>
      <Tag color={color}>{`${value}单`}</Tag>
      <Button type="link" className="fr" onClick={() => history.goBack()}>
        返回上一页
      </Button>
    </div>
  );
};
export default connect(({ loading, orderModel }) => ({
  orderModel,
  loading: loading.models.orderModel,
}))(Index);
