import React from 'react';
import { Table, Form, InputNumber } from 'antd';
import FormRules from '@/utils/FormRules';

const SkuTable = (props) => {
  const { skuAttrs = [], dataSource = [] } = props;

  dataSource.forEach((i) => {
    i.propKey = i.name.join('|');
  });

  const columns = [
    {
      title: [skuAttrs[0]],
      dataIndex: 'mainSpec',
      align: 'center',
      width: 100,
    },
    {
      title: '零售价',
      dataIndex: 'sales',
      align: 'center',
      width: 100,
      render: (val, record) => {
        return (
          <Form.Item
            className="mb0"
            name={`${record.propKey}|sales`}
            rules={[
              { required: true, message: '请输入零售价' },
              FormRules.priceValidator('零售价'),
            ]}
          >
            <InputNumber />
          </Form.Item>
        );
      },
    },
    {
      title: '划线价',
      align: 'center',
      width: 100,
      dataIndex: 'marketPrice',
      render: (val, record) => {
        return (
          <Form.Item
            className="mb0"
            name={`${record.propKey}|marketPrice`}
            rules={[FormRules.priceValidator('划线价')]}
          >
            <InputNumber />
          </Form.Item>
        );
      },
    },
    {
      title: '限购',
      align: 'center',
      width: 100,
      dataIndex: 'limit',
      render: (val, record) => {
        return (
          <Form.Item
            className="mb0"
            name={`${record.propKey}|limit`}
            rules={[FormRules.integerValidator('限购')]}
          >
            <InputNumber />
          </Form.Item>
        );
      },
    },
    {
      title: '库存',
      align: 'center',
      width: 100,
      dataIndex: 'stock',
      render: (val, record) => {
        return (
          <Form.Item
            className="mb0"
            name={`${record.propKey}|stock`}
            rules={[FormRules.integerValidator('库存')]}
          >
            <InputNumber placeholder="不限" />
          </Form.Item>
        );
      },
    },
  ];

  function mergerColumns() {
    if (skuAttrs.length === 2) {
      const col = {
        key: 'id',
        title: [skuAttrs[1]],
        dataIndex: 'secondSpec',
        align: 'center',
        width: 100,
      };
      columns.splice(1, 0, col);
    }
    return columns;
  }

  return (
    <Table
      rowKey="propKey"
      rowClassName="editable-row"
      columns={mergerColumns()}
      dataSource={dataSource}
      pagination={false}
    />
  );
};

export default SkuTable;
