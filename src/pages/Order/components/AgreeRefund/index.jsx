import React, { useState, useEffect } from 'react';
import { Modal, Input, Form } from 'antd';
import { dealAfter } from '../../service';

const Index = (props) => {
  const { visible, id, onOk, cancel, value } = props;
  const [reasonVisible, setVisible] = useState(visible);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setVisible(visible);
    form.resetFields();
  }, [visible]);

  useEffect(() => {
    if (cancel) cancel(reasonVisible);
  }, [reasonVisible]);

  async function resolveConfirm() {
    const res = await form.validateFields();
    if (res) {
      const { refundAmount } = res;
      setConfirmLoading(true);
      await dealAfter({ id, dealType: 'agree', refundAmount });
      setConfirmLoading(false);
      setVisible(false);
      if (onOk) onOk(refundAmount);
    }
  }

  function customValidate(_, val) {
    if (isNaN(val)) return Promise.reject('请输入正确的退款金额');
    val = parseFloat(val);
    if (!/^\d+(?:.\d{1,2})?$/g.test(val)) {
      return Promise.reject('请输入正确的退款金额');
    }
    if (val > value) return Promise.reject('输入金额不能大于退款金额');
    return Promise.resolve();
  }
  return (
    <Modal
      title="退款金额"
      visible={reasonVisible}
      onOk={resolveConfirm}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <Form form={form} initialValues={{ refundAmount: value }}>
        <Form.Item
          name="refundAmount"
          rules={[{ required: true, validator: customValidate }]}
          label="退款金额"
        >
          <Input placeholder="请输入退款金额" maxLength={10000000000} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Index;
