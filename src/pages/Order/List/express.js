import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
// import moment from 'moment';

import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import ExportOrder from './components/ExportOrder/index';
import ExpressBtnGroup from '../components/BtnGroup/Express';

import { commonInitForm } from '../init';
import { formList } from './components/express/expressFormList';
import { columns } from './components/express/expressColumns';

const ACTION = {
  getList: 'orderModel/getOrderList',
  getGroupList: 'orderModel/getGroupList',
  setDva: 'orderModel/setDva',
};

const Index = (props) => {
  const [formValues, setFormValues] = useState({});
  const [exportExcel, setExportExcel] = useState(false);

  const [form] = Form.useForm();
  const { dispatch } = props;

  const {
    location: { query },
  } = history;

  useEffect(() => {
    // groupName;
  }, []);

  const {
    loading,
    orderModel: { orderData, groupList },
  } = props;

  function handleFormReset() {
    // form.resetFields();
    form.setFieldsValue(commonInitForm());
    setFormValues(commonInitForm());
  }

  function handleSearch() {
    form.validateFields().then((res) => {
      const data = { ...commonInitForm(), ...res };
      setFormValues(data);
    });
  }
  // 加载获取列表数据
  function load() {
    const prams = { ...commonInitForm(), ...formValues, ...query };
    dispatch({
      type: ACTION.getList,
      payload: prams,
    });
  }
  // table分页切换时回调
  async function tableChange(pagination) {
    const { pageSizeOptions, current, total, currentPage, pageSize, ...rest } = pagination;
    const params = {
      ...formValues,
      currentPage: currentPage || current,
      pageSize,
      ...rest,
    };
    await setFormValues(params);
    load();
  }
  // 搜索团购
  const groupListSearch = (val) => {
    if (val) {
      dispatch({
        type: ACTION.getGroupList,
        payload: { name: val },
      });
    }
  };

  function renderForm() {
    const initialValues = { ...commonInitForm(), ...query, ...formValues };
    return (
      <>
        <CustomerForm
          FormList={formList({ groupList, onSearch: groupListSearch })}
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
        <div className="text-right">
          <Button
            type="primary"
            className="ml10"
            icon={<PrinterOutlined />}
            onClick={() => {
              setExportExcel(true);
            }}
          >
            导出
          </Button>
        </div>
      </>
    );
  }

  function checkDetail(data) {
    history.push({
      pathname: '/order/detail',
      query: { orderId: data.orderId },
    });
  }

  return (
    <>
      <PageHeaderWrapper>
        <Card title={renderForm()}>
          <CustomerTable
            rowKey="orderId"
            loading={loading}
            data={orderData}
            columns={columns(
              (e) => (
                <ExpressBtnGroup load={handleSearch} data={e} />
              ),
              checkDetail,
            )}
            param={formValues}
            scroll={{ x: 1000 }}
            onTableChange={(res) => {
              tableChange(res);
            }}
            size="small"
          />
        </Card>
      </PageHeaderWrapper>
      <ExportOrder
        visible={exportExcel}
        cancel={setExportExcel}
        onOk={() => {
          setExportExcel(false);
        }}
      />
    </>
  );
};

export default connect(({ loading, orderModel }) => ({
  orderModel,
  loading: loading.effects[ACTION.getList],
}))(Index);
