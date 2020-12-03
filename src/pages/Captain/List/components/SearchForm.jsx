import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import CustomerForm from '@/components/CustomerForm';
import { Form, Button } from 'antd';
import routeMap from '@/routeMap';

import actionMap from '../../actionMap';

const SearchForm = (props) => {
  const [form] = Form.useForm();
  const [initialValues, setInitValues] = useState({});
  const {
    location: { query = {} },
  } = history;
  const {
    loaded,
    verifyStatus,
    updateFormValues,
    dispatch,
    groupHeader: { pickupTypeList = [] },
  } = props;

  useEffect(() => {
    const {
      status = '',
      name = '',
      contactName = '',
      contactMobile = '',
      captainId = '',
      type = '',
      typeName = '',
    } = query;
    setInitValues({
      name,
      status,
      contactMobile,
      contactName,
      captainId,
      type: type ? { value: type, label: typeName } : undefined,
    });

    dispatch({
      type: actionMap.getPickupType,
      payload: {},
    });
  }, []);

  const FormList = [
    {
      type: 'select',
      name: 'status',
      label: '状态',
      optionData: verifyStatus,
      elOptions: {
        className: 'w100',
        placeholder: '请选择状态',
      },
    },
    {
      type: 'input',
      name: 'captainId',
      label: '团长编码',
      formItemOption: {
        className: 'mb10',
      },
      elOptions: {
        className: 'w250',
        allowClear: true,
        placeholder: '请输入团长编码',
      },
    },
    {
      type: 'input',
      name: 'name',
      label: '自提点名称',
      elOptions: {
        className: 'w250',
        allowClear: true,
        placeholder: '请输入自提点名称',
      },
    },
    {
      type: 'select',
      name: 'type',
      label: '自提点类型',
      optionData: pickupTypeList,
      elOptions: {
        labelInValue: true,
        // value: { label: 1, value: 2 },
        className: 'w250',
        placeholder: '请选择自提点类型',
      },
    },
    {
      type: 'input',
      name: 'contactName',
      label: '团长姓名',
      elOptions: {
        className: 'w250',
        allowClear: true,
        placeholder: '请输入团长姓名',
      },
    },
    {
      type: 'input',
      name: 'contactMobile',
      label: '团长电话',
      elOptions: {
        allowClear: true,
        placeholder: '请输入团长电话',
      },
    },
  ];

  const handleSearch = () => {
    form.validateFields().then((res) => {
      // 下拉框为了默认显示值而不是id，需要传typeName
      const { type = {}, ...ret } = res;
      updateFormValues({ ...ret, type: type.value, typeName: type.label, currentPage: 1 });
    });
  };

  function restForm() {
    const emptyValues = {
      captainId: '',
      name: '',
      status: '',
      type: undefined,
      contactMobile: '',
      contactName: '',
      currentPage: 1,
      pageSize: 20,
    };
    form.setFieldsValue(emptyValues);
    updateFormValues(emptyValues);
  }

  return (
    <>
      {!loaded ? null : (
        <CustomerForm
          FormList={FormList}
          layout="inline"
          hideButton
          form={form}
          initialValues={initialValues}
          extra={
            <div className="fx1">
              <Button
                type="primary"
                className="ml10"
                onClick={() => {
                  handleSearch();
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                className="ml10"
                onClick={() => {
                  restForm();
                }}
              >
                重置
              </Button>
              {/* <Button
                type="primary"
                className="fr"
                onClick={() => {
                  history.push(routeMap.captainAdd);
                }}
              >
                创建团长
              </Button> */}
            </div>
          }
        />
      )}
    </>
  );
};

export default connect(({ loading, groupHeader }) => ({
  groupHeader,
  pickupTypeLoading: loading.effects[actionMap.getPickupType],
}))(SearchForm);
