/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { Card, Form, Input, InputNumber, Button, DatePicker, Radio, Modal, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import moment from 'moment';
import ROUTE_MAP from '@/routeMap';
// TODO: 暂时不需要团购内容
// import ContentRender from '../components/ContentRender';

// TODO: 暂时不需要默认值
// const utils = require('@/utils/utils');

const { Item } = Form;
const { RangePicker } = DatePicker;

// TODO: 暂时不需要发货方式
// const deliveryTypeMap = [
//   { label: '快递到家', value: 0 },
//   { label: '门店自提', value: 1 },
// ];

const GrouponInfo = (props) => {
  const { query } = history.location;
  const { dispatch } = props;
  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  // TODO: 暂时不需要默认值
  // const initialValues = {
  //   times: utils.beforeDay(),
  //   deliveryTime: moment().add(3, 'days').set({ hour: 9, minute: 0 }),
  // };

  function getGroupInfo() {
    dispatch({
      type: 'groupon/getGroupInfo',
      payload: { groupbuyingId: query.id },
      callback: (res) => {
        const { startTime, endTime, title, description } = res;
        let { deliveryTime } = res;
        const times = [moment(startTime), moment(endTime)];
        deliveryTime = moment(res.deliveryTime);
        form.setFieldsValue({ title, times, deliveryTime, description });
      },
    });
  }

  function handleSubmit(value) {
    const { times } = value;
    const [s, e] = times;
    value.startTime = s.format('YYYY-MM-DD HH:mm');
    value.endTime = e.format('YYYY-MM-DD HH:mm');
    delete value.times;
    value.deliveryTime = value.deliveryTime.format('YYYY-MM-DD HH:mm');
    value.advanceTime = value.advanceTime && value.advanceTime.format('YYYY-MM-DD HH:mm');
    const payload = {
      ...value,
      type: 'create',
    };
    if (query.id) {
      payload.id = query.id;
      payload.type = 'update';
    }
    dispatch({
      type: 'groupon/onSaveGroupInfo',
      payload,
      callback: ({ id }) => {
        if (query.id) return message.success('团购信息保存成功');
        return Modal.confirm({
          title: '团购创建成功',
          icon: <CheckCircleFilled />,
          okText: '返回列表',
          cancelText: '编辑商品',
          onOk: () => history.replace(ROUTE_MAP.grouponList),
          onCancel: () => history.replace(`${ROUTE_MAP.grouponProducts}?id=${id}`),
        });
      },
    });
  }

  useEffect(() => {
    if (query.id) getGroupInfo();
  }, []);

  function itemRender(el, itemOptions, elOptions = {}) {
    let El = null;
    switch (el) {
      case 'input':
        El = <Input placeholder={`请输入${itemOptions.label}`} {...elOptions} />;
        break;
      case 'area':
        El = <Input.TextArea placeholder={`请输入${itemOptions.label}`} {...elOptions} />;
        break;
      case 'rangePicker':
        El = <RangePicker {...elOptions} />;
        break;
      case 'inputNumber':
        El = <InputNumber placeholder={`请输入${itemOptions.label}`} {...elOptions} />;
        break;
      case 'radio':
        El = <Radio.Group {...elOptions} />;
        break;
      case 'date':
        El = <DatePicker {...elOptions} />;
        break;
      default:
        El = el;
    }
    return <Item {...itemOptions}>{El}</Item>;
  }

  // TODO: 快递方式暂时不需要
  // function deliveryMapRender(type) {
  //   switch (type) {
  //     case 0:
  //       return itemRender(
  //         'inputNumber',
  //         {
  //           label: '快递费',
  //           name: 'expressPrice',
  //           rules: [{ required: true, message: '快递费不能为空!' }],
  //         },
  //         {
  //           className: 'w50p',
  //           formatter: (value) => `${value}${value ? '元' : ''}`,
  //           min: 0,
  //         },
  //       );
  //     case 1:
  //       return itemRender(
  //         'inputNumber',
  //         {
  //           label: '快递费',
  //           name: 'expressPrice',
  //           rules: [{ required: true, message: '快递费不能为空!' }],
  //         },
  //         {
  //           className: 'w50p',
  //           formatter: (value) => `${value}${value ? '元' : ''}`,
  //           min: 0,
  //         },
  //       );
  //     default:
  //       return null;
  //   }
  // }

  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  // function timesDisabledDate(current) {
  //   return current && current < moment().startOf('day');
  // }

  // function timesDisabledTime(a, b, c) {
  //   console.log(a, b, c);
  //   // console.log(current && current.hour());
  //   return {
  //     disabledHours: () => range(0, 24).splice(4, 20),
  //     disabledMinutes: () => range(30, 60),
  //     disabledSeconds: () => [55, 56],
  //   };
  // }

  function advanceTimeDisabled(current, startTime) {
    if (!current || !startTime) return false;
    if (current.date() === startTime.date()) {
      return {
        disabledHours: () => range(startTime.hour() + 1, 24),
        disabledMinutes: () =>
          range(current.hour() === startTime.hour() ? startTime.minute() : 60, 60),
      };
    }
    return null;
  }

  function advanceTimeRender(times = []) {
    const [startTime] = times;
    return itemRender(
      'date',
      {
        label: '预告时间',
        name: 'advanceTime',
      },
      {
        className: 'w80p',
        showTime: { format: 'HH:mm' },
        format: 'YYYY-MM-DD HH:mm',
        placeholder: '请选择预告时间',
        disabledDate: (current) => current && startTime && current > startTime.endOf('minute'),
        disabledTime: (current) => advanceTimeDisabled(current, startTime),
      },
    );
  }

  function handleChangeTimes(times) {
    const endTime = times[1];
    form.setFieldsValue({
      deliveryTime: endTime.add(1, 'days').set({ hour: 9, minute: 0, second: 0 }),
    });
  }

  const itemRenderMap = [
    {
      type: 'input',
      itemOptions: {
        label: '团购名称',
        name: 'title',
        rules: [{ required: true, message: '团购名称不能为空!' }],
      },
      elOptions: { maxLength: 50 },
    },
    {
      type: 'area',
      itemOptions: {
        label: '团购描述',
        name: 'description',
      },
      elOptions: { autoSize: { minRows: 3, maxRows: 3 }, maxLength: 200 },
    },
    {
      type: 'rangePicker',
      itemOptions: {
        label: '起止时间',
        name: 'times',
        rules: [{ required: true, message: '起止时间不能为空!' }],
      },
      elOptions: {
        className: 'w80p',
        showTime: { format: 'HH:mm' },
        format: 'YYYY-MM-DD HH:mm',
        onChange: (value) => handleChangeTimes(value),
        // disabledDate: timesDisabledDate,
        // disabledTime: timesDisabledTime,
      },
    },
    {
      type: 'date',
      itemOptions: {
        label: '到货时间',
        name: 'deliveryTime',
        rules: [{ required: true, message: '到货时间不能为空!' }],
      },
      elOptions: {
        className: 'w80p',
        showTime: { format: 'HH:mm' },
        format: 'YYYY-MM-DD HH:mm',
        placeholder: '请选择到货时间',
      },
    },
    // {
    //   type: <ContentRender />,
    //   itemOptions: {
    //     label: '团购内容',
    //     name: 'content',
    //   },
    //   elOptions: { autoSize: { minRows: 4, maxRows: 4 } },
    // },
    // {
    //   type: 'inputNumber',
    //   itemOptions: {
    //     label: '起购金额',
    //     name: 'startAmount',
    //     rules: [{ required: true, message: '起购金额不能为空!' }],
    //   },
    //   elOptions: {
    //     className: 'w50p',
    //     formatter: (value) => `${value}${value ? '元' : ''}`,
    //     min: 0,
    //   },
    // },
    // {
    //   type: 'radio',
    //   itemOptions: {
    //     label: '配送方式',
    //     name: 'deliveryType',
    //   },
    //   elOptions: {
    //     options: deliveryTypeMap,
    //     buttonStyle: 'solid',
    //     optionType: 'button',
    //   },
    // },
  ];

  return (
    <PageHeaderWrapper title={query.id ? '编辑团购' : '新建团购'}>
      <Card
        title="团购信息"
        extra={
          query.id ? (
            <Button
              type="primary"
              onClick={() => history.push(`${ROUTE_MAP.grouponProducts}?id=${query.id}`)}
            >
              编辑商品
            </Button>
          ) : null
        }
      >
        <div className="df justify-center">
          <Form
            form={form}
            // initialValues={initialValues}  TODO: 暂时不需要默认值
            className="w60p"
            {...layout}
            onFinish={handleSubmit}
          >
            {itemRenderMap.map(({ type, itemOptions, elOptions = {} }, index) => (
              <div key={index}>{itemRender(type, itemOptions, elOptions)}</div>
            ))}
            <Item noStyle shouldUpdate>
              {({ getFieldValue }) => advanceTimeRender(getFieldValue('times'))}
            </Item>
            {/* <Item noStyle shouldUpdate>
              {({ getFieldValue }) => deliveryMapRender(getFieldValue('deliveryType'))}
            </Item> */}
            <div className="df justify-center">
              <Item noStyle>
                <Button type="primary" htmlType="submit">
                  {query.id ? '保 存' : '开 团'}
                </Button>
              </Item>
            </div>
          </Form>
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, groupon }) => ({
  groupon,
  loading: loading.effects['groupon/queryGrouponInfo'],
}))(GrouponInfo);
