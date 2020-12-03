import React from 'react';
import CreateFormItem from '@/components/CustomerForm/createFormItem';

const FormInfo = (props) => {
  const editForm = [
    {
      type: 'input',
      name: 'name',
      label: '商品名称',
      placeholder: '请输入商品名称',
      rule: [{ required: true, whitespace: true, message: '商品名称不能为空!' }],
      elOptions: {
        maxLength: 50,
      },
    },
    {
      type: 'textarea',
      name: 'desc',
      label: '商品描述',
      placeholder: '请输入商品描述',
      elOptions: {
        showCount: true,
        maxLength: 500,
        rows: 4,
      },
    },
  ];

  return <CreateFormItem FormList={editForm} />;
};

export default FormInfo;
