import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';

import AgreeRefund from '../AgreeRefund/index';
import RefuseRefund from '../RefuseRefund/index';
import RefuseCancelOrder from '../RefuseCancelOrder/index';
import { dealCancel } from '../../service';

const Index = (props) => {
  const [visible, setVisible] = useState(false);
  const [refuseCancelVisible, setRefuseCancelVisible] = useState(false);
  const [refuseRefundVisible, setRefuseRefundVisible] = useState(false);
  const [currentId, setCurrentId] = useState(undefined);
  const [refundAmount, setRefundAmount] = useState(0);
  const { load, data } = props;
  if (!(data.refundStatus === 1)) return null;

  // 同意取消订单相关操作
  async function handleResolveCancel(id) {
    await dealCancel({ id, dealType: 'agree' });
    load();
  }

  function dialogConfirm(id, type = 1, amount) {
    setCurrentId(id);
    if (type === 1) setRefuseCancelVisible(true);
    if (type === 2) setRefuseRefundVisible(true);
    if (type === 3) setVisible(true);
    if (amount && amount > 0) setRefundAmount(amount);
  }

  function btnGroup() {
    const { refundType, id, refundAmount: amount } = data;
    if (refundType === 1) {
      return (
        <>
          <Button type="link" danger className="mr10" onClick={() => dialogConfirm(id)}>
            拒绝
          </Button>
          <Popconfirm
            title="同意取消订单?"
            onConfirm={() => {
              handleResolveCancel(id);
            }}
            onCancel={() => {}}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" className="mr10">
              同意
            </Button>
          </Popconfirm>
        </>
      );
    }
    if (refundType === 2) {
      return (
        <>
          <Button type="link" danger className="mr10" onClick={() => dialogConfirm(id, 2)}>
            拒绝退款
          </Button>
          <Button type="link" className="mr10" onClick={() => dialogConfirm(id, 3, amount)}>
            同意退款
          </Button>
        </>
      );
    }
    return '--';
  }

  return (
    <>
      {btnGroup()}
      <AgreeRefund
        value={refundAmount}
        visible={visible}
        orderId={currentId}
        onOk={load}
        cancel={setVisible}
      />
      <RefuseRefund
        visible={refuseRefundVisible}
        id={currentId}
        onOk={load}
        cancel={setRefuseRefundVisible}
      />
      <RefuseCancelOrder
        visible={refuseCancelVisible}
        id={currentId}
        onOk={load}
        cancel={setRefuseCancelVisible}
      />
    </>
  );
};

export default Index;
