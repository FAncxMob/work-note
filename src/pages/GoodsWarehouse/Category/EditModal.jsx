import React, { useEffect } from 'react';
import { connect } from 'umi';

import { Form, Modal, Input, message } from 'antd';
import './index.less';

const EditAndAddModal = (props) => {
  const { visible, setVisible, title, initValues = {}, onOk } = props;
  const [form] = Form.useForm();

  const { dispatch } = props;

  useEffect(() => {
    if (visible) form.setFieldsValue({ name: initValues.name });
  }, [visible]);

  function handleSubmit() {
    const name = form.getFieldValue('name');
    if (!checkFormValue()) return;

    const { id } = initValues;

    dispatch({
      type: id ? 'goodsWarehouseCategory/update' : 'goodsWarehouseCategory/add',
      payload: id
        ? {
            name,
            id,
          }
        : {
            name,
          },
      callback: () => {
        onOk();
        setVisible(false);
        message.success(`${id ? '编辑成功' : '添加成功'}`);
      },
    });
  }

  function checkFormValue() {
    if (!form.getFieldValue('name')) {
      message.warning('请输入分类名称');
      return false;
    }
    return true;
  }

  return (
    <Modal
      forceRender
      onOk={handleSubmit}
      onCancel={() => setVisible(false)}
      visible={visible}
      title={title}
    >
      <Form form={form} initialValues={initValues}>
        <Form.Item name="name" label="分类名称" className="detail-rule">
          <Input autoFocus allowClear placeholder="请输入分类名称（10字以内）" maxLength="10" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ goodsWarehouseCategory, loading }) => ({
  goodsWarehouseCategory,
  loading: loading.models.goodsWarehouseCategory,
}))(EditAndAddModal);
