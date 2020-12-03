import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Select } from 'antd';
import { cancelPayOrder } from '../../service';

const ACTION = {
  getReasonList: 'orderModel/getReasonList',
  setDva: 'orderModel/setDva',
};

const CancelOrderReason = (props) => {
  const {
    visible,
    dispatch,
    orderId,
    onOk,
    cancel,
    orderModel: { reasonList },
  } = props;
  const [reason, setReason] = useState(undefined);
  const [reasonVisible, setVisible] = useState(visible);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    getReasonsList();
  }, []);

  useEffect(() => {
    setVisible(visible);
    if (!visible) setReason(undefined);
  }, [visible]);

  useEffect(() => {
    if (cancel) cancel(reasonVisible);
  }, [reasonVisible]);

  async function handleOk() {
    setConfirmLoading(true);
    await cancelPayOrder({ orderId, refundReason: reason, operatorType: 'seller' });
    setConfirmLoading(false);
    setVisible(false);
    if (onOk) onOk(reason);
  }
  // 获取取消订单理由
  function getReasonsList() {
    if (reasonList.length < 1) {
      dispatch({
        type: ACTION.getReasonList,
      });
    }
  }
  return (
    <Modal
      title="选择取消订单理由"
      visible={reasonVisible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <Select
        options={reasonList}
        placeholder="请选择取消订单的理由"
        className="w100p"
        value={reason}
        onChange={(val) => {
          setReason(val);
        }}
      />
    </Modal>
  );
};
export default connect(({ orderModel }) => ({
  orderModel,
}))(CancelOrderReason);
