import React from 'react';
import { Tag, Collapse, Tooltip } from 'antd';
import timeFormat from '@/utils/timefomart';
import { orderStatus } from '../../../init';
import GoodInfo from '../GoodInfo/index.jsx';
import SellerRemark from '../../../components/SellerRemark/index';
import { setAddress } from '../../../utils';

const { Panel } = Collapse;

// table栏的title
export const columns = (btnGroup, checkDetail) => {
  return [
    {
      key: '0',
      title: '订单编号',
      align: 'center',
      // dataIndex: 'orderId',
      width: 86,
      render: (data) => (
        <>
          <Tooltip title="查看订单详情">
            <span
              className="cup text-primary"
              type="link"
              onClick={() => {
                checkDetail(data);
              }}
            >
              {data.orderId}
            </span>
          </Tooltip>
        </>
      ),
    },
    {
      title: '用户信息',
      key: '1',
      width: 110,
      align: 'center',
      render: ({ nickname, phoneNum }) => {
        return (
          <>
            <p className="mb5">{nickname || '--'}</p>
            <p className="mb0">{phoneNum || '--'}</p>
          </>
        );
      },
    },
    {
      title: '快递信息',
      width: 200,
      key: '2',
      align: 'center',
      render: ({ orderExpress, orderDelivery }) => {
        const data = orderExpress || orderDelivery;
        if (!data) return '--';
        return (
          <>
            <Collapse bordered={false} ghost>
              <Panel header={`快递地址:${setAddress(data)}`} key="1">
                <p className="pl24">快递公司:{data.companyName || '--'}</p>
                <p className="pl24">快递单号:{data.deliveryNo || data.expressNo || '--'}</p>
                <p className="pl24">收货人:{data.username || '--'}</p>
                <p className="pl24">收货人电话:{data.mobile || data.expressMobile || '--'}</p>
              </Panel>
            </Collapse>
          </>
        );
      },
    },
    {
      title: '订单金额(元)',
      width: 100,
      key: '4',
      dataIndex: 'orderAmount',
      align: 'center',
      render: (val) => {
        return (
          <>
            <span>¥{val}</span>
          </>
        );
      },
    },
    {
      title: '商品信息',
      width: 220,
      key: '5',
      align: 'center',
      render: (data) => {
        if (!data.skus || data.skus.length < 1) return '--';
        return (
          <>
            <Collapse bordered={false} ghost>
              <Panel
                header={`总计${data.goodsNum || '--'}件/实付¥${data.payAmount || '--'}`}
                key="1"
              >
                <GoodInfo data={data} />
              </Panel>
            </Collapse>
          </>
        );
      },
    },
    {
      title: '备注',
      width: 200,
      key: '9',
      align: 'center',
      render: ({ remark, sellerRemark, orderId }) => {
        return (
          <>
            <Collapse bordered={false} ghost>
              <Panel header={`团员备注:${remark || '--'}`} key="1">
                <SellerRemark value={sellerRemark} orderId={orderId} />
              </Panel>
            </Collapse>
          </>
        );
      },
    },
    {
      title: '订单状态',
      width: 85,
      key: '6',
      dataIndex: 'orderStep',
      align: 'center',
      render: (val) => {
        if (val) {
          const { value, color } = orderStatus[val];
          return <Tag color={color}>{value}</Tag>;
        }
        return '--';
      },
    },
    {
      title: '下单时间',
      width: 76,
      key: '7',
      dataIndex: 'createTime',
      align: 'center',
      render: (val) => {
        return (
          <>
            <span>{timeFormat(val)}</span>
          </>
        );
      },
    },
    {
      title: '支付时间',
      width: 76,
      key: '8',
      dataIndex: 'payTime',
      align: 'center',
      render: (val) => {
        return (
          <>
            <span>{timeFormat(val)}</span>
          </>
        );
      },
    },

    {
      title: '操作',
      key: '10',
      align: 'center',
      fixed: 'right',
      width: 185,
      render: (data) => {
        const { orderStep } = data;
        if (orderStep === 'WaitForDelivery' || orderStep === 'WaitForReceive')
          return btnGroup(data);
        return '--';
      },
    },
  ];
};
