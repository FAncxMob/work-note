/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Card, Form, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import GrouponHeader from '../components/GrouponHeader';

const defaultValue = {
  spuId: '',
  spuName: '',
  categoryId: '',
};

const GrouponProductSaleData = (props) => {
  const [formValues, setFormValues] = useState({});
  const {
    dispatch,
    loading,
    grouponData: { categoryList, productSaleData },
  } = props;
  const { query } = history.location;
  const [form] = Form.useForm();

  const { spuId = '', spuName = '', categoryId = '' } = query;
  const initialValues = { spuId, spuName, categoryId };

  const columns = [
    {
      key: 'skuId',
      title: '商品编码',
      dataIndex: 'skuId',
      width: 120,
    },
    {
      title: '商品名称',
      width: 120,
      render: ({ spuName, skuName }) => `${spuName}-${skuName}`,
    },
    {
      title: '商品分类',
      align: 'center',
      dataIndex: 'category',
      width: 150,
    },
    {
      title: '零售价',
      dataIndex: 'marketPrice',
      width: 80,
      render: (value) => `￥${value}`,
    },
    {
      title: '团购价',
      dataIndex: 'groupPrice',
      width: 80,
      render: (value) => `￥${value}`,
    },
    {
      title: '商品销量',
      dataIndex: 'payOrderCount',
      width: 100,
    },
    {
      title: '支付总金额',
      dataIndex: 'payAmount',
      width: 120,
      render: (value) => `￥${value}`,
    },
    {
      title: '支付人数',
      dataIndex: 'payOrderCount',
      width: 100,
    },
    {
      title: '退款数量',
      dataIndex: 'refundSkuCount',
      width: 80,
    },
    {
      title: '退款总金额',
      dataIndex: 'refundAmount',
      width: 120,
      render: (value) => `￥${value}`,
    },
    {
      title: '退款率',
      dataIndex: 'refundPercent',
      width: 80,
      render: (value) => `${value}%`,
    },
  ];

  useEffect(() => {
    getCategoryList();
  }, []);

  function getCategoryList() {
    dispatch({ type: 'grouponData/getCategoryList' });
  }

  function getProductSalesData() {
    dispatch({ type: 'grouponData/getProductSaleData', payload: query });
  }

  function handleSearch() {
    form.validateFields().then((res) => restForm(res));
  }

  function restForm(param) {
    setFormValues({ ...formValues, ...param });
  }

  function handleStandardTableChange(pagination) {
    const { pageSizeOptions, current, total, currentPage, pageSize, ...rest } = pagination;
    const params = {
      currentPage: currentPage || current,
      pageSize,
      ...rest,
    };
    setFormValues(params);
    getProductSalesData();
  }

  function RenderForm() {
    const FormList = [
      {
        type: 'input',
        name: 'spuId',
        label: '商品编码',
        elOptions: {
          placeholder: '请输入商品编码',
        },
      },
      {
        type: 'input',
        name: 'spuName',
        label: '商品名称',
        elOptions: {
          placeholder: '请输入商品名称',
        },
      },
      {
        type: 'select',
        name: 'categoryId',
        label: '商品分类',
        elOptions: {
          className: 'w150',
        },
        optionData: categoryList,
      },
    ];

    return (
      <CustomerForm
        FormList={FormList}
        layout="inline"
        hideButton
        initialValues={initialValues}
        form={form}
        extra={
          <Form.Item>
            <Button onClick={() => restForm(defaultValue)}>重置</Button>
            <Button type="primary" className="ml10" onClick={() => handleSearch()}>
              查询
            </Button>
          </Form.Item>
        }
      />
    );
  }

  return (
    <PageHeaderWrapper title={<GrouponHeader />}>
      <Card title={RenderForm()}>
        <CustomerTable
          rowKey="skuId"
          loading={loading}
          data={productSaleData}
          columns={columns}
          param={formValues}
          onTableChange={handleStandardTableChange}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, grouponData }) => ({
  grouponData,
  loading: loading.effects['grouponData/getProductSaleData'],
}))(GrouponProductSaleData);
