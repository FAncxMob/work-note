/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import { connect, history } from 'umi';
import { Card, Form, Button, Tag, Dropdown, Menu, Divider, Modal } from 'antd';
import { CaretDownOutlined, QuestionCircleFilled } from '@ant-design/icons';
import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import moment from 'moment';

import ROUTE_MAP from '@/routeMap';

const statusMap = [
  { value: '', label: '全部' },
  { value: 0, label: '未开始', color: 'yellow' },
  { value: 1, label: '进行中', color: 'green' },
  { value: 2, label: '已结束', color: '' },
];

const initValue = {
  name: '',
  status: '',
};

const GrouponList = (props) => {
  const {
    dispatch,
    groupon: { grouponList },
    loading,
  } = props;
  const [formValues, setFormValues] = useState({});
  const { query } = history.location;
  const [form] = Form.useForm();

  const initialValues = { ...initValue, ...query };

  const columns = [
    {
      key: 'id',
      title: '团购名称',
      dataIndex: 'name',
      width: 230,
    },
    {
      title: '经营数据',
      width: 50,
      render: ({ saleAmount, orderPersonCount, browseCount }) => (
        <div className="fz12">
          <span>实际收入: {saleAmount}</span>
          <br />
          <span>下单人数: {orderPersonCount}</span>
          <br />
          <span>浏览次数: {browseCount}</span>
        </div>
      ),
    },
    {
      title: '起止时间',
      align: 'center',
      width: 150,
      render: ({ startTime, endTime }) =>
        `${moment(startTime).format('YYYY-MM-DD HH:mm')} ~ ${moment(endTime).format(
          'YYYY-MM-DD HH:mm',
        )}`,
    },
    {
      title: '团购状态',
      align: 'center',
      dataIndex: 'status',
      width: 80,
      render: (val) =>
        val !== undefined && <Tag color={statusMap[val + 1].color}>{statusMap[val + 1].label}</Tag>,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (record) => {
        return (
          <>
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleEvent(key, record)}>
                  <Menu.Item key="editInfo">编辑</Menu.Item>
                  <Menu.Item key="editProducts">商品信息</Menu.Item>
                  <Menu.Item key="shareInformation">推广文案</Menu.Item>
                  {record.status === 2 ? (
                    <Menu.Item key="start">开始</Menu.Item>
                  ) : (
                    <Menu.Item key="end">结束</Menu.Item>
                  )}
                  <Menu.Item key="delete">删除</Menu.Item>
                  <Menu.Item key="copy">复制</Menu.Item>
                </Menu>
              }
            >
              <a>
                团购 <CaretDownOutlined />
              </a>
            </Dropdown>
            <Divider type="vertical" />
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleEvent(key, record)}>
                  <Menu.Item key="salesData">销售数据</Menu.Item>
                  <Menu.Item key="productsData">商品数据</Menu.Item>
                  <Menu.Item key="reportDownload">报表下载</Menu.Item>
                  <Menu.Item key="receipt">团长收货单</Menu.Item>
                </Menu>
              }
            >
              <a>
                数据 <CaretDownOutlined />
              </a>
            </Dropdown>
          </>
        );
      },
    },
  ];

  function handleFormReset() {
    const init = { ...initValue };
    form.setFieldsValue(init);
    setFormValues({ ...query, ...init });
  }

  function handleSearch() {
    form.validateFields().then((res) => {
      const data = { ...initialValues, ...res };
      setFormValues(data);
    });
  }

  function handleAction(type, { id, text }) {
    Modal.confirm({
      title: `确认${text}该团购吗？`,
      icon: <QuestionCircleFilled />,
      onOk: () => {
        dispatch({
          type: 'groupon/action',
          payload: { id, type },
          callback: () => load(),
        });
      },
    });
  }

  function handleEvent(key, record) {
    const id = record && record.id;
    switch (key) {
      case 'create':
        return history.push(ROUTE_MAP.grouponCreate);
      case 'editInfo':
        return history.push({ pathname: ROUTE_MAP.grouponEdit, query: { id } });
      case 'editProducts':
        return history.push(`${ROUTE_MAP.grouponProducts}?id=${id}`);
      case 'start':
        return handleAction('start', { id, text: '开始' });
      case 'end':
        return handleAction('end', { id, text: '结束' });
      case 'delete':
        return handleAction('delete', { id, text: '删除' });
      case 'copy':
        return handleAction('copy', { id, text: '复制' });
      case 'shareInformation':
        return history.push(`${ROUTE_MAP.grouponShareInformation}?grouponId=${id}`);
      case 'salesData':
        return history.push(`${ROUTE_MAP.grouponSalesData}?grouponId=${id}`);
      case 'productsData':
        return history.push(`${ROUTE_MAP.grouponProductsData}?grouponId=${id}`);
      case 'reportDownload':
        return history.push(`${ROUTE_MAP.grouponReportDownload}?grouponId=${id}`);
      case 'receipt':
        return history.push(`${ROUTE_MAP.grouponReceiptData}?grouponId=${id}`);
      default:
        console.log(key);
        return '';
    }
  }

  function titleContent() {
    const formList = [
      {
        type: 'input',
        name: 'name',
        label: '团购名称',
        elOptions: {
          allowClear: true,
          placeholder: '请输入商品名称',
        },
      },
      {
        type: 'radio',
        name: 'status',
        label: '团购状态',
        elOptions: {
          options: statusMap,
          optionType: 'button',
          buttonStyle: 'solid',
          size: 'middle',
        },
      },
    ];
    return (
      <CustomerForm
        FormList={formList}
        layout="inline"
        initialValues={initialValues}
        hideButton
        form={form}
        extra={
          <Form.Item>
            <Button onClick={handleFormReset}>重置</Button>
            <Button type="primary" className="ml10" onClick={handleSearch}>
              查询
            </Button>
          </Form.Item>
        }
      />
    );
  }

  function load(params) {
    const payload = { ...params, ...query };
    dispatch({
      type: 'groupon/queryGrouponList',
      payload,
    });
  }

  function handleStandardTableChange(response) {
    const { pageSizeOptions, current, total, currentPage, pageSize, ...rest } = response;
    const params = {
      currentPage: currentPage || current,
      pageSize,
      ...rest,
    };
    setFormValues({ ...formValues, ...params });
    load();
  }

  return (
    <PageHeaderWrapper title="团购列表">
      <Card
        title={titleContent()}
        extra={
          <Button type="primary" onClick={() => handleEvent('create')}>
            一键开团
          </Button>
        }
      >
        <CustomerTable
          rowKey="id"
          loading={loading}
          data={grouponList}
          columns={columns}
          onTableChange={handleStandardTableChange}
          param={formValues}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, groupon }) => ({
  groupon,
  loading: loading.effects['groupon/queryGrouponList'],
}))(GrouponList);
