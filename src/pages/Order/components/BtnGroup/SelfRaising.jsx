import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import CancelOrderReason from '../CancelOrderReason/index';
import { delivery, receive } from '../../service';

const Index = (props) => {
  const [visible, setVisible] = useState(false);
  const [currentId, setCurrentId] = useState(undefined);
  const { data, load } = props;
  const { orderStep, orderId } = data;

  // 取消订单
  function cancelOrder(id) {
    setVisible(true);
    setCurrentId(id);
  }
  // 发货
  async function deliverOrder(orderId) {
    await delivery({ orderId, deliveryNo: '', companyName: '' });
    load();
  }

  // 确认送达/提货
  async function confirmDeliver(orderId) {
    try {
      await receive({ orderId });
      load();
    } catch (error) {
      console.log(error);
    }
  }

  if (!(orderStep === 'WaitForDelivery' || orderStep === 'WaitForReceive')) return null;
  return (
    <>
      {orderStep === 'WaitForDelivery' ? (
        <Button type="link" className="mr10" onClick={() => cancelOrder(orderId)}>
          取消订单
        </Button>
      ) : null}
      {orderStep === 'WaitForDelivery' ? (
        <Popconfirm
          title="确认发货吗?"
          onConfirm={() => {
            deliverOrder(orderId);
          }}
          onCancel={() => {}}
          okText="确认"
          cancelText="取消"
        >
          <Button type="link" className="mr10">
            发货
          </Button>
        </Popconfirm>
      ) : (
        <Popconfirm
          title="确认已经收货吗?"
          onConfirm={() => {
            confirmDeliver(orderId);
          }}
          onCancel={() => {}}
          okText="确认"
          cancelText="取消"
        >
          <Button type="link" className="mr10">
            确认提货
          </Button>
        </Popconfirm>
      )}

      <CancelOrderReason visible={visible} orderId={currentId} onOk={load} cancel={setVisible} />
    </>
  );
};

export default Index;
