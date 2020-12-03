import React, { useState, useEffect } from 'react';
import { Modal, Input, Form, message } from 'antd';
import { delivery } from '../../service';

const CancelOrderReason = (props) => {
  const { visible, orderId, onOk, cancel, expressInfo } = props;
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
      setConfirmLoading(true);
      const res1 = await delivery({ orderId, ...res });
      setConfirmLoading(false);
      setVisible(false);
      message.success(expressInfo ? '修改成功' : '发货成功');
      if (onOk) onOk(res1);
    });
  }
  // 设置已有的却分快递单和配送单
  if (expressInfo) expressInfo.deliveryNo = expressInfo.expressNo || expressInfo.deliveryNo;

  return (
    <Modal
      title="请输入快递信息"
      visible={reasonVisible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setVisible(false);
      }}
    >
      {/* <Forms visible={visible} expressInfo={expressInfo} form={form} /> */}
      <Form form={form} initialValues={expressInfo}>
        <Form.Item
          name="deliveryNo"
          rules={[{ required: true, message: '请输入快递单号' }]}
          label="快递单号"
        >
          <Input placeholder="请输入快递单号" allowClear />
        </Form.Item>
        <Form.Item
          name="companyName"
          rules={[{ required: true, message: '请输入快递公司名' }]}
          label="快递公司"
        >
          <Input placeholder="请输入快递公司名" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CancelOrderReason;
