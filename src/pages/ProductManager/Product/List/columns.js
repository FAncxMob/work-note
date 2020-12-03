import React from 'react';
import { Tag, Tooltip, Popover } from 'antd';
import UFF from '@/utils/UFF';
import { deliverWayMap, shelveStatusMap, auditStatusMap, deliverWay, stockStatus } from '../utils';

const REFUSEURL = require('@/images/defaultShopLogo.jpg');

const deliverWayMaps = [...deliverWayMap];
deliverWayMaps.unshift({ value: '', label: '全部', color: '' });
// table栏的title
export const columns = (btnGroup) => {
  return [
    {
      key: '0',
      title: '商品ID',
      align: 'center',
      dataIndex: 'id',
      width: 86,
      render: (id) => (
        <>
          <span>{id}</span>
        </>
      ),
    },
    {
      title: '商品名称',
      width: 120,
      key: '11',
      dataIndex: 'name',
      align: 'center',
      render: (val) => {
        const len = val.length > 10 ? '......' : '';
        return (
          <>
            <span>{val.slice(0, 10) + len}</span>
          </>
        );
      },
    },
    {
      title: '商品信息',
      key: '1',
      align: 'center',
      width: 200,
      render: ({ image, skuAttrs }) => {
        const isGuide = skuAttrs && skuAttrs.length > 0;
        return (
          <>
            {isGuide ? (
              <Tooltip title="标识多规格">
                <Tag color="blue">多</Tag>
              </Tooltip>
            ) : null}
            <img src={UFF.getProductImage(image) || REFUSEURL} className="h60 w60 bdr4" />
          </>
        );
      },
    },
    {
      title: '分类',
      width: 120,
      key: '2',
      align: 'center',
      render: ({ categoryName }) => {
        return categoryName ? <span>{categoryName}</span> : '--';
      },
    },
    {
      title: '平台佣金',
      align: 'center',
      width: 150,
      key: '3',
      render: ({ maxCommission, minCommission }) => {
        if (maxCommission && maxCommission !== minCommission) {
          return `￥${minCommission}-￥${maxCommission}`;
        }
        if (minCommission) {
          return `￥${minCommission}`;
        }
        return '--';
      },
    },
    {
      title: '价格',
      align: 'center',
      key: '4',
      width: 200,
      render: ({ minSales, maxSales, maxMarketPrice, minMarketPrice }) => (
        <>
          <div>{`划线价￥${minSales}${
            maxSales && maxSales !== minSales ? `-￥${maxSales}` : ''
          }`}</div>
          <div>{`零售价价￥${minMarketPrice}${
            maxMarketPrice && maxMarketPrice !== minMarketPrice ? `-￥${maxMarketPrice}` : ''
          }`}</div>
        </>
      ),
    },
    {
      title: '库存',
      align: 'center',
      dataIndex: 'stock',
      width: 86,
      key: '6',
      render: (val) => <span>{stockStatus(val)}</span>,
    },
    {
      title: '限购数',
      width: 120,
      key: '2',
      align: 'center',
      render: ({ categoryName }) => {
        return categoryName ? <span>{categoryName}</span> : '--';
      },
    },
    {
      title: '标签',
      width: 120,
      key: '2',
      dataIndex: 'tags',
      align: 'center',
      render: (val) => {
        if (val && val.length > 0) {
          return val.map((item, index) => (
            <Tag color="green" key={index}>
              {item}
            </Tag>
          ));
        }
        return '--';
      },
    },
    // {
    //   title: '发货方式',
    //   align: 'center',
    //   key: '5',
    //   dataIndex: 'deliveryType',
    //   width: 120,
    //   render: (val) => {
    //     const current = deliverWayMaps.find((item) => item.value === val);
    //     return current ? <Tag color={current.color}>{deliverWay(val)}</Tag> : '--';
    //   },
    // },
    // {
    //   title: '服务城市',
    //   align: 'center',
    //   dataIndex: 'serviceCities',
    //   key: '7',
    //   width: 100,
    //   render: (val) => {
    //     return <span>{val ? val.join(',') : '--'}</span>;
    //   },
    // },
    {
      title: '上架状态',
      align: 'center',
      key: '8',
      dataIndex: 'shelveStatus',
      width: 100,
      render: (val) => {
        const current = shelveStatusMap.find((item) => item.value === val);
        if (current) return <Tag color={current.color}>{current.text}</Tag>;
        return '';
      },
    },
    {
      title: '审核状态',
      align: 'center',
      key: '9',
      width: 100,
      render: ({ auditStatus, reason }) => {
        const content = reason || '暂无原因';
        const current = auditStatusMap.find((item) => item.value === auditStatus);
        if (auditStatus === 3) {
          return (
            <Popover content={content} title="审核失败原因" arrowPointAtCenter>
              <Tag color={current.color}>{current.text}</Tag>
            </Popover>
          );
        }
        if (current) return <Tag color={current.color}>{current.text}</Tag>;
        return '--';
      },
    },
    {
      title: '操作',
      key: '10',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (data) => {
        return btnGroup(data);
      },
    },
  ];
};
