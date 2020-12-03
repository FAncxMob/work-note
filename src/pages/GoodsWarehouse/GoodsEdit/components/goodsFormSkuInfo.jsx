import React from 'react';
import CreateFormItem from '@/components/CustomerForm/createFormItem';
import SkuEdit from './SkuEdit';

const FormInfo = (props) => {
  const { form } = props;

  const editForm = [
    {
      el: <SkuEdit form={form} />,
      label: '多规格',
      name: 'moreSku',
      rule: [
        {
          validator: (rule, value) => {
            const { skus = [] } = value;
            if (!skus.length) return Promise.reject('请添加商品规格');
            return Promise.resolve();
          },
        },
      ],
    },
  ];

  return <CreateFormItem FormList={editForm} />;
};

export default FormInfo;
