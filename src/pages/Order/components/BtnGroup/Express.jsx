import React, { useState } from 'react';
import { Button } from 'antd';
import CancelOrderReason from '../CancelOrderReason/index';
import DeliverGoods from '../DeliverGoods/index';

const Index = (props) => {
  const [visible, setVisible] = useState(false);
  const [deliverVisible, setDeliverVisible] = useState(false);
  const [currentId, setCurrentId] = useState(undefined);
  const [expressInfo, setExpressInfo] = useState(null);

  function cancelOrder(id) {
    setVisible(true);
    setCurrentId(id);
  }

  function deliverOrder(id, data) {
    setDeliverVisible(true);
    setCurrentId(id);
    setExpressInfo(data);
  }

  const { orderStep, orderId, orderExpress, orderDelivery } = props.data;
  const expressData = orderExpress || orderDelivery;

  if (!(orderStep === 'WaitForDelivery' || orderStep === 'WaitForReceive')) return null;
  return (
    <>
      {orderStep === 'WaitForDelivery' ? (
        <Button type="link" danger className="mr10 " onClick={() => cancelOrder(orderId)}>
          取消订单
        </Button>
      ) : null}

      <Button type="link" className="mr10" onClick={() => deliverOrder(orderId, expressData)}>
        {orderStep === 'WaitForReceive' ? '修改快递单号' : '发货'}
      </Button>

      <CancelOrderReason
        visible={visible}
        orderId={currentId}
        onOk={props.load}
        cancel={setVisible}
      />
      <DeliverGoods
        visible={deliverVisible}
        orderId={currentId}
        expressInfo={expressInfo}
        cancel={setDeliverVisible}
        onOk={props.load}
      />
    </>
  );
};

export default Index;
