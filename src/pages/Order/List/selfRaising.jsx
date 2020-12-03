import React, { useState } from 'react';
import { connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, message } from 'antd';
import { PrinterOutlined, DeliveredProcedureOutlined } from '@ant-design/icons';

import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import ExportOrder from './components/ExportOrder/index';
import SelfRaisingBtnGroup from '../components/BtnGroup/SelfRaising';

import { commonInitForm } from '../init';
import { formList } from './components/selfRaising/selfFormList';
import { columns } from './components/selfRaising/selfColumns';

// import { delivery, receive } from '../service';

const pickUpInitForm = commonInitForm('Pickup');

const ACTION = {
  getList: 'orderModel/getOrderList',
};

const ProductList = (props) => {
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();
  const { dispatch } = props;

  const [exportExcel, setExportExcel] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const {
    location: { query },
  } = history;

  const {
    loading,
    orderModel: { orderData, groupList },
  } = props;

  function handleFormReset() {
    // form.resetFields();
    form.setFieldsValue(pickUpInitForm);
    setFormValues(pickUpInitForm);
  }

  function handleSearch() {
    form.validateFields().then((res) => {
      res.categoryIds = formValues.categoryIds;
      const data = { ...pickUpInitForm, ...res };
      setFormValues(data);
    });
  }
  // 加载获取列表数据
  function load() {
    const prams = { ...pickUpInitForm, ...formValues, ...query };
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
  const groupListSearch = (val) => {
    if (val) {
      dispatch({
        type: 'orderModel/getGroupList',
        payload: {},
      });
    } else {
      dispatch({
        type: 'orderModel/setDva',
        payload: [],
      });
    }
  };

  function RenderForm() {
    const initialValues = { ...pickUpInitForm, ...query, ...formValues };
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
          {selectedRowKeys.length > 0 ? (
            <Button
              type="primary"
              className="ml10 pr30"
              icon={<DeliveredProcedureOutlined />}
              onClick={batchSendOrders}
            >
              批量发货
            </Button>
          ) : null}
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

  // 批量发货
  function batchSendOrders() {
    // const arr = selectedRowKeys.map(item=>item.orderId)
    message.warn('功能待定中');
  }

  function checkDetail(data) {
    history.push({
      pathname: '/order/detail',
      query: { orderId: data.orderId },
    });
  }

  const getProStatus = (val) => {
    if (val.orderStep === 'WaitForDelivery') return false;
    return true;
  };

  const rowSelection = {
    onChange: (keys, rows) => {
      setSelectedRowKeys(rows);
    },
    getCheckboxProps: (record) => ({
      disabled: getProStatus(record),
      name: record.orderId,
    }),
  };

  return (
    <>
      <PageHeaderWrapper>
        <Card title={<RenderForm />}>
          <CustomerTable
            rowKey="orderId"
            loading={loading}
            rowRadioSelection={{ ...rowSelection, type: 'checkbox' }}
            data={orderData}
            columns={columns(
              (e) => (
                <SelfRaisingBtnGroup data={e} load={handleSearch} />
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
  loading: loading.models.orderModel,
}))(ProductList);
