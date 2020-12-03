import React from 'react';
import FormRules from '@/utils/FormRules';
import CreateFormItem from '@/components/CustomerForm/createFormItem';

const FormInfo = () => {
  const editForm = [
    {
      type: 'input',
      name: 'sales',
      label: '零售价',
      elOptions: {
        placeholder: '请输入零售价',
      },
      rule: [
        { required: true, message: '商品零售价不能为空!' },
        FormRules.priceValidator('零售价'),
      ],
    },
    {
      type: 'input',
      name: 'marketPrice',
      label: '划线价',
      elOptions: {
        placeholder: '请输入划线价',
      },
      rule: [FormRules.priceValidator('划线价')],
    },
    {
      type: 'input',
      name: 'stock',
      label: '库存',
      elOptions: {
        placeholder: '不限',
      },
      rule: [FormRules.integerValidator('库存')],
    },
    {
      type: 'input',
      name: 'limit',
      label: '限购数',
      rule: [FormRules.integerValidator('限购')],
      elOptions: {
        placeholder: '请输入限购数',
      },
    },
  ];

  return <CreateFormItem FormList={editForm} />;
};

export default FormInfo;
