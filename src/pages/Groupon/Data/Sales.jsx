/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Card, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import GrouponHeader from '../components/GrouponHeader';
import { formatData } from '../utils';

const saleInfoMap = [
  { label: '销售总金额', key: 'saleAmount', value: '', formatFn: (value) => priceContent(value) },
  {
    label: '订单总数',
    key: 'orderNum',
    value: '',
    formatFn: (value) => initialNumberContent(value),
  },
  {
    label: '下单人数',
    key: 'orderPersonNum',
    value: '',
    formatFn: (value) => initialNumberContent(value),
  },
  {
    label: '浏览人数',
    key: 'viewPersonNum',
    value: '',
    formatFn: (value) => initialNumberContent(value),
  },
  { label: '支付/访问转化率', key: 'payRate', value: '', formatFn: (value) => rateContent(value) },
  {
    label: '销售商品总数',
    key: 'productNum',
    value: '',
    formatFn: (value) => initialNumberContent(value),
  },
  { label: '客单价', key: 'perPrice', value: '', formatFn: (value) => priceContent(value) },
  {
    label: '优惠总金额',
    key: 'discountAmount',
    value: '',
    formatFn: (value) => priceContent(value),
  },
  {
    label: '佣金总额',
    key: 'commissionAmount',
    value: '',
    formatFn: (value) => priceContent(value),
  },
];

const afterSaleInfoMap = [
  { label: '退款总金额', key: 'refundAmount', value: '', formatFn: (value) => priceContent(value) },
  {
    label: '退款订单总数',
    key: 'refundOrderNum',
    value: '',
    formatFn: (value) => initialNumberContent(value),
  },
  {
    label: '退款人数',
    key: 'refundPersonNum',
    value: '',
    formatFn: (value) => initialNumberContent(value),
  },
  {
    label: '退款商品总数',
    key: 'refundProductNum',
    value: '',
    formatFn: (value) => initialNumberContent(value),
  },
  { label: '支付/退款率', key: 'refundRate', value: '', formatFn: (value) => rateContent(value) },
];

function initialNumberContent(value) {
  return (
    <div className="df justify-center">
      <div className="fz30">{value}</div>
    </div>
  );
}

function priceContent(value) {
  return (
    <div className="df justify-center align-end">
      <div className="por fz16 text-regular" style={{ top: '-7px' }}>
        ￥
      </div>
      <div className="fz30">{value}</div>
    </div>
  );
}

function rateContent(value) {
  return (
    <div className="df justify-center align-end">
      <div className="fz30">{value}</div>
      <div className="por fz16 text-regular pl5" style={{ top: '-7px' }}>
        %
      </div>
    </div>
  );
}

const GrouponSaleData = (props) => {
  const [saleFormatInfo, setSaleFormatInfo] = useState([]);
  const [afterSaleFormatInfo, setAfterSaleFormatInfo] = useState([]);
  const { dispatch } = props;

  useEffect(() => {
    getSalesData();
  }, []);

  function getSalesData() {
    const { grouponId: groupId } = history.location.query;
    dispatch({
      type: 'grouponData/getGrouponSaleData',
      payload: { groupId },
      callback: (res) => formatAllData(res),
    });
  }

  function formatAllData(data) {
    const { saleInfo, afterSaleInfo } = data;
    setSaleFormatInfo(formatData(saleInfo, saleInfoMap));
    setAfterSaleFormatInfo(formatData(afterSaleInfo, afterSaleInfoMap));
  }
  return (
    <PageHeaderWrapper title={<GrouponHeader />}>
      <Card title="实时销售信息">
        <Row gutter={[20, 20]}>
          {saleFormatInfo.map(({ label, key, value }) => (
            <Col md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} key={key}>
              <Card>
                <div className="text-center text-primary">
                  <div className="text-regular">{label}</div>
                  {value}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      <Card title="实时售后信息" className="mt20">
        <Row gutter={[20, 20]}>
          {afterSaleFormatInfo.map(({ label, key, value }) => (
            <Col md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} key={key}>
              <Card>
                <div className="text-center text-warning">
                  <div className="text-regular">{label}</div>
                  {value}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, grouponData }) => ({
  grouponData,
  loading: loading.models.grouponData,
}))(GrouponSaleData);
