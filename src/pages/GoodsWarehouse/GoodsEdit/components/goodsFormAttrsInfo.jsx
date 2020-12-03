import React from 'react';
import CreateFormItem from '@/components/CustomerForm/createFormItem';

const deliveryTypeOptions = [
  { value: 'pickupAndExpress', text: '全部' },
  { value: 'pickup', text: '自提' },
  { value: 'express', text: '配送' },
];

const FormInfo = (props) => {
  const { typeList } = props;

  const editForm = [
    {
      type: 'radioGroup',
      name: 'deliveryType',
      label: '配送方式',
      optionData: deliveryTypeOptions,
      rule: [{ required: true, whitespace: true, message: '请选择配送方式!' }],
    },

    {
      type: 'select',
      name: 'categoryIds',
      label: '商品库分类',
      optionData: typeList,
      selectAll: false,
      elOptions: {
        mode: 'multiple',
      },
    },
  ];

  return <CreateFormItem X FormList={editForm} />;
};

export default FormInfo;
