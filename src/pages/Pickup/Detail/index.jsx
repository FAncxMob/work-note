import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerForm from '@/components/CustomerForm';
import { Card, Form, Button, Spin } from 'antd';
import { mobilePattern } from '@/utils/verificationRules';
import AMapPOI from '@/components/AMap/AMapPOI';

const ACTION = {
  add: 'pickupDetailManage/add',
  edit: 'pickupDetailManage/edit',
  getDetail: 'pickupDetailManage/getDetail',
  clear: 'pickupDetailManage/clear',
};

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 },
};
const tailFormItemLayout = {
  wrapperCol: { offset: 2, span: 16 },
};

/**
 *
 * 路由所需参数
 * [id]
 */
const PickupDetail = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [form] = Form.useForm();
  const {
    dispatch,
    pickupDetailManage: { detailInfo },
    submitting,
    infoLoading,
  } = props;

  const editFormList = [
    {
      type: 'input',
      name: 'name',
      label: '名称',
      placeholder: '请输入自提点名称',
      rule: [{ required: true, whitespace: true, message: '自提点名称不能为空!' }],
    },
    {
      label: '地址',
      name: 'addressInfo',
      el: <AMapPOI />,
      rule: [{ required: true, message: '自提点地址不能为空!' }],
    },
    {
      type: 'input',
      name: 'detail',
      label: '详细地址',
      placeholder: '请输入自提点详细地址',
      rule: [{ required: true, whitespace: true, message: '自提点详细地址不能为空!' }],
    },
    {
      type: 'input',
      name: 'contactName',
      label: '联系人',
      placeholder: '请输入自提点联系人',
      rule: [{ required: true, whitespace: true, message: '自提点联系人不能为空!' }],
    },
    {
      type: 'input',
      name: 'contactMobile',
      label: '联系电话',
      placeholder: '请输入自提点联系人电话',
      rule: [
        { required: true, whitespace: true, message: '自提点联系人电话不能为空!' },
        { pattern: mobilePattern, message: '请输入正确的手机号!' },
      ],
    },
  ];

  const {
    location: {
      query: { id },
    },
  } = history;

  const isEdit = !!id;
  const pageTitle = isEdit ? '编辑自提点' : '新增自提点';

  const componentWillUnmount = () => {
    dispatch({
      type: ACTION.clear,
    });
  };

  const loadInfo = () => {
    dispatch({
      type: ACTION.getDetail,
      payload: {
        id,
      },
      callback() {
        setLoaded(true);
      },
    });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((res) => {
        const { addressInfo, ...ret } = res;
        const {
          pname: province,
          cityname: city,
          adname: area,
          address: communityAddress,
          location: { lat, lng },
        } = addressInfo;
        const completeAddress = province + city + area + communityAddress;

        const payload = {
          province,
          city,
          area,
          communityAddress,
          lat,
          lng,
          completeAddress,
          ...ret,
        };
        if (isEdit) {
          payload.id = id;
        }
        dispatch({
          type: isEdit ? ACTION.edit : ACTION.add,
          payload,
          callback: () => {
            history.go(-1);
          },
        });
      })
      .catch(() => {});
  };

  const renderSubmit = infoLoading ? null : (
    <Button type="primary" loading={submitting} onClick={() => handleSubmit()}>
      保存
    </Button>
  );

  const renderForm = () => {
    return (
      <Spin spinning={!!submitting}>
        <CustomerForm
          formItemLayout={layout}
          initialValues={detailInfo}
          tailFormItemLayout={tailFormItemLayout}
          FormList={editFormList}
          hideButton
          form={form}
          extra={<Form.Item {...tailFormItemLayout}>{renderSubmit}</Form.Item>}
        />
      </Spin>
    );
  };

  useEffect(() => {
    if (isEdit) {
      loadInfo();
    } else {
      setLoaded(true);
    }
    return componentWillUnmount;
  }, []);

  return (
    <PageHeaderWrapper title={pageTitle}>
      <Card extra={renderSubmit} loading={infoLoading}>
        {infoLoading || !loaded ? null : renderForm()}
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, pickupDetailManage }) => ({
  pickupDetailManage,
  submitting: loading.effects[ACTION.add] || loading.effects[ACTION.edit],
  infoLoading: loading.effects[ACTION.getDetail],
}))(PickupDetail);
