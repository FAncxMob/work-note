import React, { Component } from 'react';
import { history, connect } from 'umi';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import Title from './components/Title/index';
import Status from './components/Status/index';
import Info from './components/Info/index';

const ACTION = {
  details: 'orderModel/getOrderDetails',
};
class Detail extends Component {
  UNSAFE_componentWillMount() {
    this.getOrderDetail();
  }

  async getOrderDetail() {
    const {
      location: { query },
    } = history;
    // id售后单，orderId自提或是快递
    // const { id, orderId } = query;
    this.props.dispatch({
      type: ACTION.details,
      payload: { ...query },
    });
  }

  render() {
    const { orderDetail } = this.props.orderModel;
    if (!orderDetail) {
      return null;
    }
    return (
      <PageHeaderWrapper>
        <Card title={<Title data={orderDetail} />}>
          <Status data={orderDetail} />
          <Info data={orderDetail} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default connect(({ loading, orderModel }) => ({
  orderModel,
  loading: loading.effects[ACTION.details],
}))(Detail);
