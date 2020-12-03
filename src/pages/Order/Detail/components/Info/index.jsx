import React from 'react';
import timeFormat from '@/utils/timefomart';
import { type } from '../../../init';
// import SellerRemark from '../../../List/components/SellerRemark/index';
import { setAddress } from '../../../utils';

const Index = (props) => {
  const {
    deliveryType,
    remark,
    nickname,
    payAmount, // 订单支付金额
    payTime, // 支付时间
    paidTime, // 支付时间
    payWay, // 支付方式
    mobile,
    phoneNum,
    deliveryInfo,
    orderExpress,
    orderDelivery,
    orderPickup,
  } = props.data;

  const expressData = deliveryInfo || orderExpress || orderDelivery || orderPickup;
  const { value } = type[deliveryType];

  function expressInfo() {
    if (deliveryType !== 'Pickup') {
      return (
        <>
          <p className="mb0 word-break text-black-primary">
            {value}公司:{expressData.companyName || '--'}
          </p>
          <p className="mb0 text-black-primary">
            {value}单号:{expressData.deliveryNo || expressData.expressNo || '--'}
          </p>
          <p className="mb0 text-black-primary">
            {value}电话:{expressData.expressMobile || '--'}
          </p>
        </>
      );
    }
    return (
      <>
        <p className="mb0 word-break text-black-primary">自提点:{expressData.pickupName || '--'}</p>
        <p className="mb0 text-black-primary">自提点联系人:{expressData.pickupContact || '--'}</p>
        <p className="mb0 text-black-primary">自提点电话:{expressData.pickupMobile || '--'}</p>
      </>
    );
  }
  return (
    <>
      <div className="bgc-base bdr5 mt20 p15">
        <ul className="df align-start justify-between pl0 mb0">
          <li className="fx1 pr20">
            <p className="mb8 fwb">收货人信息</p>
            <p className="mb0 text-black-primary">收货人：{expressData.username || '--'}</p>
            <p className="mb0 text-black-primary">
              电话：{expressData.mobile || expressData.expressMobile || '--'}
            </p>
          </li>
          <li className="fx1 pr20">
            <p className="mb8 fwb">配送信息</p>
            <p className="mb0 text-black-primary">配送方式：{value}</p>
            <p className="mb0 word-break text-black-primary">
              {value}地址：{setAddress(expressData, deliveryType)}
            </p>
            {expressInfo()}
          </li>
          <li className="fx1 pr20">
            <p className="mb8 fwb">付款信息</p>
            <p className="mb0 text-black-primary">实付金额：¥{payAmount || '0'}</p>
            <p className="mb0 text-black-primary">支付方式：{payWay || '--'}</p>
            <p className="mb0 text-black-primary">付款时间：{timeFormat(payTime || paidTime)}</p>
          </li>
          <li className="fx1 pr20">
            <p className="mb8 fwb">买家信息</p>
            <p className="mb0 text-black-primary">昵称：{nickname || '--'}</p>
            <p className="mb0 text-black-primary">电话：{mobile || phoneNum || '--'}</p>
            <p className="mb0 text-black-primary word-break">备注：{remark || '--'}</p>
          </li>
        </ul>
      </div>
    </>
  );
};
export default Index;
