/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import { connect, history } from 'umi';
import { Card, Form, Button, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import moment from 'moment';
import ROUTE_MAP from '@/routeMap';
import GrouponHeader from '../components/GrouponHeader';

const defaultValue = {
  contactName: '',
  contactMobile: '',
  pickupName: '',
  receiptNo: '',
  isLogistics: '',
};

const ReceiptData = (props) => {
  const [formValues, setFormValues] = useState({});
  const {
    dispatch,
    loading,
    grouponData: { receiptData },
  } = props;
  const { query } = history.location;
  const [form] = Form.useForm();

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
      key: 'receiptNo',
      align: 'center',
      title: '收货单号',
      dataIndex: 'receiptNo',
      width: 120,
    },
    {
      title: '团长姓名',
      width: 100,
      dataIndex: 'contactName',
    },
    {
      title: '团长手机号',
      align: 'center',
      dataIndex: 'contactMobile',
      width: 120,
    },
    {
      title: '自提点名称',
      dataIndex: 'pickupName',
      width: 150,
    },
    {
      title: '应收总数',
      align: 'center',
      dataIndex: 'count',
      width: 80,
    },
    {
      title: '实收总数',
      align: 'center',
      dataIndex: 'realQuantity',
      width: 100,
    },
    {
      title: '收货状态',
      align: 'center',
      width: 120,
      render: ({ isLogistics = 0, logisticsStatus = 1 }) => {
        let index = isLogistics;
        if (logisticsStatus === 0) index = 2;
        const flagMap = [
          { text: '未收货', color: 'cyan' },
          { text: '已收货', color: 'green' },
          { text: '异常', color: 'red' },
        ];
        return <Tag color={flagMap[index].color}>{flagMap[index].text}</Tag>;
      },
    },
    {
      title: '收货时间',
      align: 'center',
      dataIndex: 'createTime',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      align: 'center',
      width: 80,
      render: ({
        pickupId,
        groupId,
        helpSellId,
        contactName,
        contactMobile,
        pickupAddress,
        updateTime,
        receiptNo,
        images,
      }) => (
        <a
          onClick={() => {
            history.push({
              pathname: `${ROUTE_MAP.grouponReceiptDetailData}/${query.grouponId}`,
              state: {
                contactName,
                contactMobile,
                pickupAddress,
                updateTime,
                receiptNo,
                images,
                pickupId,
                groupId,
                helpSellId,
              },
            });
          }}
        >
          明细
        </a>
      ),
    },
  ];

  function getReceiptData() {
    dispatch({ type: 'grouponData/getReceiptData', payload: query });
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
    getReceiptData();
  }

  function RenderForm() {
    const FormList = [
      {
        type: 'input',
        name: 'contactName',
        label: '团长姓名',
        elOptions: {
          placeholder: '请输入团长姓名',
          className: 'mb5',
        },
      },
      {
        type: 'input',
        name: 'contactMobile',
        label: '团长手机号',
        elOptions: {
          placeholder: '请输入团长手机号',
        },
      },
      {
        type: 'input',
        name: 'pickupName',
        label: '自提点名称',
        elOptions: {
          placeholder: '请输入自提点名称',
        },
      },
      {
        type: 'input',
        name: 'receiptNo',
        label: '收货单号',
        elOptions: {
          placeholder: '请输入收货单号',
        },
      },
      {
        type: 'radio',
        name: 'isLogistics',
        label: '收货状态',
        elOptions: {
          options: [
            { value: '', label: '全部' },
            { value: 1, label: '已收货' },
            { value: 0, label: '未收货' },
          ],
          optionType: 'button',
          buttonStyle: 'solid',
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
          rowKey="receiptNo"
          loading={loading}
          data={receiptData}
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
  loading: loading.effects['grouponData/getReceiptData'],
}))(ReceiptData);
