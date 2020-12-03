import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CreateFormItem from '@/components/CustomerForm/createFormItem';
import { Card, Form, Button, Spin, Tooltip, message, Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Prompt from '@/components/Prompt';
import makeGoodsInfo from './tool/makeGoodsInfo';
import GoodsFormBaseInfo from './components/goodsFormBaseInfo';
import GoodsFormSingleInfo from './components/goodsFormSingleInfo';
import GoodsFormSkuInfo from './components/goodsFormSkuInfo';
import GoodsFormMediaInfo from './components/goodsFormMediaInfo';
import GoodsFormAttrsInfo from './components/goodsFormAttrsInfo';

const ACTION = {
  add: 'wareHouseGoodsManage/add',
  edit: 'wareHouseGoodsManage/edit',
  getGoods: 'wareHouseGoodsManage/getGoods',
  clearGoods: 'wareHouseGoodsManage/clearGoods',
  setGoodsInfo: 'wareHouseGoodsManage/setGoodsInfo',
  getTypeList: 'wareHouseGoodsManage/getTypeList',
  changeSkuType: 'wareHouseGoodsManage/changeSkuType',
};

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 20 },
};
const tailFormItemLayout = {
  wrapperCol: { offset: 2, span: 20 },
};

/**
 *
 * 路由所需参数
 * [id]
 */
const GoodsEdit = (props) => {
  const [goodsDetail, setGoodsDetail] = useState({});
  const [formValueChange, setFormValueChange] = useState(false);

  const [form] = Form.useForm();
  const {
    dispatch,
    wareHouseGoodsManage: { goodsInfo, typeList },
    submitting,
    infoLoading,
  } = props;

  const FormSkuType = [
    {
      type: 'radio',
      name: 'skuType',
      label: '规格',
      elOptions: {
        options: [
          { value: 'single', label: '单品' },
          { value: 'moreSku', label: '多规格' },
        ],
        optionType: 'button',
        buttonStyle: 'solid',
        onChange: (e) => {
          dispatch({
            type: ACTION.changeSkuType,
            payload: e.target.value,
          });
        },
      },
    },
  ];

  const FormSaleStatus = [
    {
      type: 'switch',
      name: 'saleStatus',
      label: (
        <span>
          销售状态
          <Tooltip title="禁售商品库商品，将会使正在售卖的相关商品停止销售">
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      formItemOption: {
        valuePropName: 'checked',
      },
      elOptions: {
        checkedChildren: '启售',
        unCheckedChildren: '禁售',
      },
    },
  ];

  const {
    location: {
      query: { id },
    },
  } = history;

  const isEdit = !!id;
  const pageTitle = isEdit ? '编辑商品' : '新增商品';

  useEffect(() => {
    load();
    return componentWillUnmount;
  }, []);

  useEffect(() => {
    setGoodsDetail(goodsInfo);
    form.setFieldsValue(goodsInfo);
  }, [goodsInfo]);

  function load() {
    if (isEdit) {
      loadInfo();
    } else {
      loadTypeList();
      dispatch({
        type: ACTION.clearGoods,
      });
    }
  }

  function componentWillUnmount() {
    setFormValueChange(form.isFieldsTouched());
    dispatch({
      type: ACTION.clearGoods,
    });
  }

  function loadTypeList() {
    dispatch({
      type: ACTION.getTypeList,
    });
  }
  function loadInfo() {
    dispatch({
      type: ACTION.getGoods,
      payload: {
        productId: id,
      },
    });
  }

  const handleSubmit = async () => {
    try {
      const res = await form.validateFields();
      const param = makeGoodsInfo({ ...goodsDetail, ...res });
      if (isEdit) {
        param.id = id;
      }
      dispatch({
        type: isEdit ? ACTION.edit : ACTION.add,
        payload: param,
        callback: () => {
          history.go(-1);
        },
      });
    } catch (error) {
      console.log(error);
      message.warn('有商品信息填写错误,请检查！');
    }
  };

  function handleGoBack() {
    setFormValueChange(form.isFieldsTouched());
    history.go(-1);
  }

  const renderSubmit = infoLoading ? null : (
    <Button type="primary" htmlType="submit" loading={submitting} onClick={() => handleSubmit()}>
      保存
    </Button>
  );

  const renderBack = (
    <Button loading={submitting} onClick={() => handleGoBack()}>
      返回
    </Button>
  );

  const Block = ({ children, title }) => {
    return (
      <div className="app-card-lv1">
        <h6>{title}</h6>
        <div className="app-card-lv2">{children}</div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <Spin spinning={!!submitting}>
        <Form
          {...layout}
          scrollToFirstError
          initialValues={goodsDetail}
          form={form}
          // onValuesChange={() => {
          //   setFormValueChange(form.isFieldsTouched());
          // }}
        >
          <Block title="基本信息">
            <GoodsFormBaseInfo />
          </Block>

          <Block title="规格信息">
            <CreateFormItem FormList={FormSkuType} />
            {goodsDetail.skuType === 'moreSku' ? <GoodsFormSkuInfo /> : <GoodsFormSingleInfo />}
          </Block>
          <Block title="其他信息">
            <CreateFormItem FormList={FormSaleStatus} />

            <GoodsFormAttrsInfo typeList={typeList} />
          </Block>
          <Block title="图文信息">
            <GoodsFormMediaInfo form={form} />
          </Block>
          <Form.Item {...tailFormItemLayout}>
            <Space>
              {renderSubmit}
              {renderBack}
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    );
  };

  return (
    <PageHeaderWrapper title={pageTitle}>
      <Prompt when={formValueChange} />
      <Card
        extra={
          <Space>
            {renderBack}
            {renderSubmit}
          </Space>
        }
        loading={infoLoading}
      >
        <div className="scrollable-container">{infoLoading ? null : renderForm()}</div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, wareHouseGoodsManage }) => ({
  wareHouseGoodsManage,
  submitting: loading.effects[ACTION.add] || loading.effects[ACTION.edit],
  infoLoading: loading.effects[ACTION.getGoods] || loading.effects[ACTION.getTypeList],
}))(GoodsEdit);
