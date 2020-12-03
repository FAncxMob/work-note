/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import { connect, history } from 'umi';
import { Card, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ROUTE_MAP from '@/routeMap';
import GrouponHeader from '../components/GrouponHeader';

const rowMap = [
  {
    taskName: '商品销售统计',
    description:
      '商品销售统计，以团为维度，统计整个团购的商品销售数据(包括团购商品 + 团购秒杀商品)。',
    downloadPath: 'GroupBuySaleExcel',
  },
  {
    taskName: '代理销售统计',
    description: '代理销售统计，以团为维度，统计代理的销售数据(包括团购商品 + 团购秒杀商品)。',
    downloadPath: 'GroupBuyCaptainSaleExcel',
  },
  {
    taskName: '订单明细表',
    description: '订单明细统计，以团为维度，统计所有订单(包括团购订单 + 团购秒杀订单)。',
    downloadPath: 'GroupBuyingOrderDetailExcel',
  },
  {
    taskName: '订单打印专用',
    description: '以团购为维度统计订单数据，表格用于导入打印系统，打印发货数据。',
    downloadPath: 'GroupBuyOrderPrintExcel',
  },
];

const ReportDownload = (props) => {
  const [saleFormatInfo, setSaleFormatInfo] = useState([]);
  const [afterSaleFormatInfo, setAfterSaleFormatInfo] = useState([]);
  const { dispatch } = props;
  const {
    location: {
      query: { grouponId: groupBuyId },
    },
  } = history;

  function handleDownload(taskType, taskName) {
    dispatch({
      type: 'grouponData/download',
      payload: {
        taskType,
        taskName,
        params: JSON.stringify({ groupBuyId }),
      },
      callback: () => {
        Modal.confirm({
          title: '申请导出成功',
          cancelText: '知道了',
          okText: '立即查看',
          content: '请稍后在"文件下载"中查看',
          icon: null,
          onOk: () => {
            history.replace(ROUTE_MAP.downloadList);
          },
        });
      },
    });
  }

  return (
    <PageHeaderWrapper title={<GrouponHeader />}>
      {rowMap.map(({ taskName, description, downloadPath }) => (
        <Card title={taskName} key={downloadPath} className="mb20">
          <div className="df justify-between">
            <div className="df align-center fx1">
              <span className="text-danger">*</span>
              <span>{description}</span>
            </div>
            <Button type="primary" onClick={() => handleDownload(downloadPath, taskName)}>
              下载
            </Button>
          </div>
        </Card>
      ))}
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, grouponData }) => ({
  grouponData,
  loading: loading.models.grouponData,
}))(ReportDownload);
