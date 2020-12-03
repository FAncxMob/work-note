import React from 'react';
import { history, connect } from 'umi';
import { Space } from 'antd';
import GoodList from '../GoodList/index';
import RefundBtnGroup from '../../../components/BtnGroup/Refund';
import SelfRaisingBtnGroup from '../../../components/BtnGroup/SelfRaising';
import ExpressBtnGroup from '../../../components/BtnGroup/Express';

// import timeFormat from '@/utils/timefomart';
import { orderStatus } from '../../../init';
import SellerRemark from '../../../components/SellerRemark/index';
import Records from '../Records/index';
import { refundStatus } from '../../../utils';

const ACTION = {
  details: 'orderModel/getOrderDetails',
};

const Index = (props) => {
  const {
    id,
    orderId,
    orderAmount,
    payAmount,
    orderStep,
    refundAmount,
    goodsAmount,
    refundStatus: status,
    refundType,
    deliveryType,
    goodsNum,
    sellerRemark,
  } = props.data;
  // 是不是售后单
  const isRefundOrder = id && refundAmount >= 0;

  function deliveryTypeStatus() {
    if (isRefundOrder) {
      const { value, color } = refundStatus(status, refundType);
      const style = {
        color,
      };
      return <span style={style}>{value}</span>;
    }
    if (orderStep) {
      const { color, value } = orderStatus[orderStep];
      const style = {
        color,
      };
      return <span style={style}>{value}</span>;
    }
    return '--';
  }

  function IsRefund() {
    if (isRefundOrder) {
      return (
        <>
          <p className="fz16 mb5 word-break">订单金额：¥{orderAmount || payAmount || '0'}</p>
          <p className="fz16 mb5 word-break">退款金额：¥{refundAmount || '0'}</p>
        </>
      );
    }
    return (
      <>
        <p className="fz16 mb5 word-break">订单金额：¥{orderAmount || payAmount || '0'}</p>
        <p className="fz16 mb5 word-break">商品金额：¥{goodsAmount || '0'}</p>
        <p className="fz16 mb5 word-break">商品数量：{goodsNum || '0'}件</p>
      </>
    );
  }

  function btnGroup() {
    function getOrderDetail() {
      try {
        const {
          location: { query },
        } = history;
        // id售后单，orderId自提或是快递
        // const { id, orderId } = query;
        props.dispatch({
          type: ACTION.details,
          payload: { ...query },
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (isRefundOrder) return <RefundBtnGroup data={props.data} load={getOrderDetail} />;
    if (deliveryType === 'Pickup')
      return <SelfRaisingBtnGroup data={props.data} load={getOrderDetail} />;
    if (deliveryType === 'Express')
      return <ExpressBtnGroup data={props.data} load={getOrderDetail} />;
  }
  return (
    <>
      <div>
        <Space direction="vertical" align="start" size={5} className="w340 pr30 fx1">
          <div className="mb5 fx1">
            <span className="fz20 fwb">{deliveryTypeStatus()}</span>
            <span className="ml70">{btnGroup()}</span>
          </div>
          <IsRefund />
          <div className="w300">
            {/* <div className="mb5 word-break">团员备注：{remark || ''}</div> */}
            <SellerRemark value={sellerRemark} orderId={orderId} />
          </div>
        </Space>
        <Space
          direction="vertical"
          align="start"
          size={10}
          className="pl14 border-left border-right pr14 min-w700"
        >
          <GoodList data={props.data} />
        </Space>
        <Space direction="vertical" align="start" size={10} className="pl30">
          {isRefundOrder ? <Records data={props.data} /> : null}
        </Space>
      </div>
    </>
  );
};
export default connect()(Index);
