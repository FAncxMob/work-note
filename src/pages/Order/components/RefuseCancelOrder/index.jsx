import React, { useState, useEffect } from 'react';
import { Modal, Input, Form } from 'antd';
import { dealCancel } from '../../service';

const { TextArea } = Input;

const Index = (props) => {
  const { visible, id, onOk, cancel } = props;
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

  async function handleOk() {
    form.validateFields().then(async (res) => {
      const { reason } = res;
      setConfirmLoading(true);
      await dealCancel({ id, dealType: 'refuse', reason });
      setConfirmLoading(false);
      setVisible(false);
      if (onOk) onOk(reason);
    });
  }

  return (
    <Modal
      title="拒绝取消订单的原因"
      visible={reasonVisible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <Form form={form}>
        <Form.Item
          name="reason"
          rules={[{ required: true, message: '请输入拒绝的原因' }]}
          label="原因"
        >
          <TextArea showCount placeholder="请输入拒绝的原因" maxLength={150} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Index;
