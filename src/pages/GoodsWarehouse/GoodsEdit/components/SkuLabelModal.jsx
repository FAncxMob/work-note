import React, { useEffect } from 'react';
import { Form, Modal, Input } from 'antd';

const ModalForm = (props) => {
  const [form] = Form.useForm();

  const { visible, onCancel = () => {}, onOk = () => {}, skuLabel = '' } = props;

  function handleOk() {
    form
      .validateFields()
      .then((res) => {
        onOk(res);
      })
      .catch(() => {});
  }

  useEffect(() => {
    form.setFieldsValue({ skuLabel });
  }, [visible]);

  return (
    <Modal
      forceRender
      visible={visible}
      maskClosable={false}
      onCancel={() => {
        onCancel();
      }}
      onOk={() => {
        handleOk();
      }}
    >
      <div>
        <p>规格项目名称:</p>
        <Form form={form}>
          <Form.Item
            name="skuLabel"
            initialValue=""
            rules={[{ required: true, whitespace: true, message: '规格项目名称不能为空!' }]}
          >
            <Input placeholder="请输入规格名称，最多20个字" maxLength={20} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalForm;
