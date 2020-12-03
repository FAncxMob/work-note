import React from 'react';
import Uff from '@/utils/UFF';

const REFUSEURL = require('@/images/defaultShopLogo.jpg');
// table栏的title
export const notRefundColumns = () => {
  return [
    {
      key: '0',
      title: '商品图片',
      align: 'center',
      dataIndex: 'image',
      width: 100,
      render: (url) => {
        return <img alt="" className="w40" src={url ? Uff.getOrderListImage(url) : REFUSEURL} />;
      },
    },
    {
      key: '1',
      title: '商品名称',
      align: 'center',
      dataIndex: 'spuName',
      width: 130,
      render: (val) => (
        <>
          <span>{val || '--'}</span>
        </>
      ),
    },
    {
      key: '2',
      title: '规格',
      align: 'center',
      dataIndex: 'skuName',
      width: 100,
      render: (val) => (
        <>
          <span>{val || '--'}</span>
        </>
      ),
    },
    {
      key: '3',
      title: '数量',
      align: 'center',
      dataIndex: 'count',
      width: 100,
      render: (val) => (
        <>
          <span>{val}件</span>
        </>
      ),
    },
    {
      key: '4',
      title: '价格',
      align: 'center',
      dataIndex: 'goodsPrice',
      width: 100,
      render: (val) => (
        <>
          <span>¥{val || '0'}</span>
        </>
      ),
    },
    {
      key: '5',
      title: '支付金额',
      align: 'center',
      dataIndex: 'payPrice',
      width: 100,
      render: (val) => (
        <>
          <span>¥{val || '0'}</span>
        </>
      ),
    },
  ];
};

export const refundColumns = () => {
  return [
    {
      key: '0',
      title: '商品图片',
      align: 'center',
      dataIndex: 'image',
      width: 100,
      render: (url) => {
        return <img className="w40" alt="" src={url ? Uff.getOrderListImage(url) : REFUSEURL} />;
      },
    },
    {
      key: '1',
      title: '商品名称',
      align: 'center',
      dataIndex: 'spuName',
      width: 130,
      render: (val) => (
        <>
          <span>{val || '--'}</span>
        </>
      ),
    },
    {
      key: '2',
      title: '规格',
      align: 'center',
      dataIndex: 'skuName',
      width: 100,
      render: (val) => (
        <>
          <span>{val || '--'}</span>
        </>
      ),
    },
    {
      key: '3',
      title: '退件数量',
      align: 'center',
      dataIndex: 'refundNum',
      width: 100,
      render: (val) => (
        <>
          <span>{val}件</span>
        </>
      ),
    },
    {
      key: '4',
      title: '商品金额',
      align: 'center',
      dataIndex: 'skuPrice',
      width: 100,
      render: (val) => (
        <>
          <span>¥{val}</span>
        </>
      ),
    },
    {
      key: '5',
      title: '支付金额',
      align: 'center',
      dataIndex: 'payPrice',
      width: 100,
      render: (val) => (
        <>
          <span>¥{val || '0'}</span>
        </>
      ),
    },
  ];
};
