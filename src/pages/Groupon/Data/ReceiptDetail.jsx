/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Card, Form, Button, Tag, Descriptions } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import moment from 'moment';

import { formatData } from '../utils';

import styles from '../index.less';

const { Item } = Descriptions;

const defaultValue = {
  contactName: '',
  contactMobile: '',
  pickupName: '',
  receiptNo: '',
  isLogistics: '',
};

const receiptInfoMap = [
  { label: '团长姓名', key: 'contactName', value: '' },
  { label: '团长手机号', key: 'contactMobile', value: '' },
  { label: '自提点名称', key: 'pickupAddress', value: '' },
  {
    label: '收货时间',
    key: 'updateTime',
    value: '',
    formatFn: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
  },
  { label: '收货单号', key: 'receiptNo', value: '' },
  {
    label: '图片',
    key: 'images',
    value: '',
    formatFn: (value) =>
      value.map((item, index) => <img className="w80 h80 mr10" src={item} alt="" key={index} />),
  },
];

const ReceiptDetailData = (props) => {
  const [formValues, setFormValues] = useState({});
  const [receiptInfo, setReceiptInfo] = useState(receiptInfoMap);
  const {
    dispatch,
    loading,
    grouponData: { receiptDetailData },
  } = props;
  const { query, state } = history.location;
  const [form] = Form.useForm();
  const { pickupId, groupId, helpSellId } = state;

  const {
    contactName = '',
    contactMobile = '',
    pickupName = '',
    receiptNo = '',
    isLogistics = '',
  } = query;
  const initialValues = { contactName, contactMobile, pickupName, receiptNo, isLogistics };

  const columns = [
    {
      key: 'skuId',
      title: '商品编码',
      align: 'center',
      dataIndex: 'skuId',
      width: 120,
    },
    {
      title: '商品名称',
      width: 200,
      dataIndex: 'spuName',
    },
    {
      title: '规格',
      align: 'center',
      dataIndex: 'skuAttrs',
      width: 120,
    },
    {
      title: '应收数量',
      align: 'center',
      dataIndex: 'count1',
      width: 80,
    },
    {
      title: '实收数量',
      align: 'center',
      dataIndex: 'count2',
      width: 100,
    },
    {
      title: '差异数量',
      align: 'center',
      width: 100,
      render: ({ count1, count2 }) => Number(count1) - Number(count2),
    },
  ];

  useEffect(() => {
    setReceiptInfo(formatData(state, receiptInfoMap));
  }, []);

  function GrouponHeader() {
    return (
      <Descriptions
        title="收货单信息"
        size="small"
        className={styles.headerDescriptions}
        column={{ xs: 1, sm: 2, md: 3 }}
      >
        {receiptInfo.map(({ label, key, value }) => (
          <Item label={label} key={key}>
            {value}
          </Item>
        ))}
      </Descriptions>
    );
  }

  function getReceiptDetailData() {
    dispatch({
      type: 'grouponData/getReceiptDetailData',
      payload: { ...query, pickupId, groupId, helpSellId },
    });
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
    getReceiptDetailData();
  }

  function RenderForm() {
    const FormList = [
      {
        type: 'input',
        name: 'skuId',
        label: '商品编码',
        elOptions: {
          placeholder: '请输入商品编码',
          className: 'mb5',
        },
      },
      {
        type: 'input',
        name: 'skuName',
        label: '商品名称',
        elOptions: {
          placeholder: '请输入商品名称',
        },
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
          data={receiptDetailData}
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
  loading: loading.effects['grouponData/getReceiptDetailData'],
}))(ReceiptDetailData);
