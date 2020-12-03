import React, { useEffect, useState } from 'react';
import { Form, Button, Modal } from 'antd';
import CreateFormItem from '@/components/CustomerForm/createFormItem';
import LinkSelector from '@/components/LinkSelector';
import Uploader from '@/components/Uploader';
import { imageType } from '@/utils/uploadConfig';
import FormRules from '@/utils/FormRules';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const EditForm = (props) => {
  const [formValue, setFormValue] = useState(null);

  const { value, onSubmit, onDelete } = props;

  useEffect(() => {
    setFormValue(value);
  }, [value]);

  const [form] = Form.useForm();

  const editForm = [
    {
      type: 'input',
      name: 'title',
      label: '标题',
      placeholder: '请输入标题',
      rule: [{ required: true, message: '请填写Banner标题！' }],
      elOptions: {
        maxLength: 50,
      },
      formItemOption: {
        ...layout,
      },
    },
    {
      el: <LinkSelector />,
      name: 'linkOption',
      label: '链接',
      formItemOption: {
        ...layout,
      },
    },
  ];

  function handleDelete() {
    Modal.confirm({
      title: '确定删除此Banner?',
      onOk: () => {
        onDelete(value);
      },
    });
  }

  async function handleSubmit() {
    try {
      const res = await form.validateFields();
      onSubmit({
        ...value,
        ...res,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return formValue ? (
    <Form form={form} initialValues={formValue}>
      <div className="df flex-column h230 justify-between">
        <div className="df">
          <div className="min-w150">
            <Form.Item
              name="image"
              valuePropName="fileList"
              rules={[
                { required: true, message: '请上传商品图片!' },
                FormRules.checkUploadFilesStatus(),
              ]}
            >
              <Uploader limit={1} accept={imageType} mode="replace" />
            </Form.Item>
          </div>
          <div className="fx1">
            <CreateFormItem FormList={editForm} />
          </div>
        </div>
        <div className="text-right">
          <Button className="mr10" onClick={() => handleDelete()}>
            删除
          </Button>
          <Button htmlType="submit" type="primary" onClick={() => handleSubmit()}>
            {formValue.id ? '应用' : '保存'}
          </Button>
        </div>
      </div>
    </Form>
  ) : null;
};

export default EditForm;
