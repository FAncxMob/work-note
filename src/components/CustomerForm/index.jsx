import React from 'react';
import { Button, Form } from 'antd';
import CreateFormItem from './createFormItem';

const CustomerForm = (props) => {
  const {
    name: formName,
    form: propForm,
    layout,
    hideButton,
    hideCancelButton,
    formItemLayout = {},
    tailFormItemLayout = {},
    okText = '确定',
    cancelText = '取消',
    initialValues,
    extra,
    onSubmit = () => {},
    formRef,
    FormList = [],
  } = props;

  const onFinish = (values) => onSubmit(values);

  return (
    <Form
      ref={formRef}
      {...formItemLayout}
      layout={layout}
      form={propForm}
      name={formName}
      onFinish={onFinish}
      initialValues={initialValues}
      scrollToFirstError
    >
      <CreateFormItem FormList={FormList} />
      {props.children}
      {!hideButton ? (
        <Form.Item {...tailFormItemLayout}>
          {hideCancelButton ? '' : <Button className="mr20">{cancelText}</Button>}
          <Button type="primary" htmlType="submit">
            {okText}
          </Button>
        </Form.Item>
      ) : null}

      {extra}
    </Form>
  );
};
export default CustomerForm;
