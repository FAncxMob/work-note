import React from 'react';
import { Collapse, Table } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';

import { notRefundColumns, refundColumns } from './uitls';

const { Panel } = Collapse;

function NotRefundGoodItem(props) {
  return <Table pagination={false} columns={notRefundColumns()} dataSource={props.arr} />;
}

function RefundGoodItem(props) {
  return <Table pagination={false} columns={refundColumns()} dataSource={props.arr} />;
}

const Index = (props) => {
  const { refundItems, details } = props.data;
  return (
    <Collapse
      bordered={false}
      ghost
      expandIcon={({ isActive }) => (
        <DoubleRightOutlined className="text-primary" rotate={isActive ? 90 : 0} />
      )}
    >
      <Panel header={`${details ? '商品列表' : '退款商品'}（点击下来展开）`} key="1">
        {details ? <NotRefundGoodItem arr={details} /> : <RefundGoodItem arr={refundItems} />}
      </Panel>
    </Collapse>
  );
};
export default Index;
