import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, DatePicker } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import timeFormat from '@/utils/timefomart';

import config from '@/utils/config';
import { exportExcel } from '../../../service';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ACTION = {
  getGroupList: 'orderModel/getGroupList',
  setDva: 'orderModel/setDva',
};

const Index = (props) => {
  const {
    visible,
    onOk,
    cancel,
    dispatch,
    orderModel: { groupList },
  } = props;
  const [reasonVisible, setVisible] = useState(visible);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setVisible(visible);
    form.resetFields();
  }, [visible]);

  useEffect(() => {
    if (cancel) cancel(reasonVisible);
  }, [reasonVisible]);

  function handleOk() {
    form.validateFields().then(async (res) => {
      setConfirmLoading(true);
      const { groupId, timeDate } = res;
      const data = {
        groupBuyId: groupId,
        startDate: timeFormat(timeDate[0]._d),
        endDate: timeFormat(timeDate[1]._d),
        enumDate: null,
      };
      const str = JSON.stringify(data);
      const res1 = await exportExcel({
        taskType: 'GroupBuyingOrderDetailExcel',
        taskName: '团购明细',
        params: str,
      });
      setConfirmLoading(false);
      // 要打开的新页面的url
      const ele = document.createElement('a');
      ele.href = `${config.outerApiUrl}/export/download/${res1.fileId}`;
      ele.target = '_blank';
      ele.click();
    });
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

  return (
    <Modal
      title="导出订单"
      visible={reasonVisible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <Form form={form}>
        <Form.Item
          name="groupId"
          rules={[{ required: true, message: '请选择团购' }]}
          label="所属团购"
        >
          <Select
            showSearch
            allowClear
            className="min-w195"
            placeholder="请选择团购"
            filterOption={false}
            onSearch={groupListSearch}
          >
            {groupList.map((item, index) => (
              <Option key={index} value={item.value}>
                {item.text}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="timeDate"
          rules={[{ required: true, message: '请选择时间段' }]}
          label="数据时间"
        >
          <RangePicker
            ranges={{
              今天: [moment(), moment()],
              本周: [moment().startOf('week'), moment().endOf('week')],
              本月: [moment().startOf('month'), moment().endOf('month')],
            }}
            showTime
            format="YYYY/MM/DD HH:mm:ss"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ loading, orderModel }) => ({
  orderModel,
  loading: loading.effects[ACTION.getGroupList],
}))(Index);
