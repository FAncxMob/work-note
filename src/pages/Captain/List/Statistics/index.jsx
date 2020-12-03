import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/indexNoLoc.jsx';
import { Card, Form, Button, Radio, Tag } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { last30days } from '@/utils/utils';
import { transformFenToYuan } from '@/models/wallet/utils';
import actionMap from '../../actionMap';
import styles from './index.less';
import { columns1, columns2 } from './data';

const { Description } = DescriptionList;

const headStyle = { background: '#fafafa', borderColor: '#e8e8e8', fontSize: '14px' };

const STATUS = [
  {
    text: '全部',
    value: '',
  },
  {
    text: '收入',
    value: 'income',
  },
  {
    text: '支出',
    value: 'outcome',
  },
];

const INIT_VALUE = { time: '', type: '' };

const Statistics = (props) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const { dispatch } = props;
  const {
    location: { query = {} },
  } = history;

  const {
    groupHeader: { groupHeaderDetail, commission, incomeAndExpense, waitForSettle, verifyStatus },
    loading1,
    loading2,
  } = props;

  useEffect(() => {
    loadDetail();
    loadCommission();
    // loadIncomeAndExpense();
    loadWaitForSettle();
    return () => {
      dispatch({
        type: actionMap.clearFlow,
        payload: {},
      });
    };
  }, []);

  const renderStatus = (status, mapList) => {
    const current = mapList.find((item) => String(item.value) === String(status));
    if (current) return <Tag color={current.color}>{current.text}</Tag>;
    return '--';
  };

  const renderDetail = () => {
    if (!groupHeaderDetail.captainInfo) return null;
    return (
      <Card title="基本信息" className="mb10" bordered={false}>
        <DescriptionList col={3} layout="horizontal">
          <Description term="团长姓名">{groupHeaderDetail.captainInfo.contactName}</Description>
          <Description term="团长电话">{groupHeaderDetail.captainInfo.contactMobile}</Description>
          <Description term="自提点名称">{groupHeaderDetail.captainInfo.name}</Description>
          <Description term="自提点类型">
            {groupHeaderDetail.captainInfo.typeName || '--'}
          </Description>
          <Description term="状态">
            {renderStatus(groupHeaderDetail.captainInfo.status, verifyStatus)}
          </Description>
        </DescriptionList>
      </Card>
    );
  };

  const renderCommission = () => {
    return (
      <Card title="佣金信息" className="mb10" bordered={false}>
        <div className={styles.commissionWrapper}>
          <Card className="numberItem" headStyle={headStyle}>
            <div className="title">可提现佣金（元）</div>
            <div className="fz20">
              ￥<span className="number">{transformFenToYuan(commission.canWithdrawalAmount)}</span>
            </div>
          </Card>
          <Card className="numberItem" headStyle={headStyle}>
            <div className="title">待结算佣金（元）</div>
            <div className="fz20">
              ￥<span className="number">{transformFenToYuan(commission.lockAmount)}</span>
            </div>
          </Card>
          <Card className="numberItem" headStyle={headStyle}>
            <div className="title">累计佣金（元）</div>
            <div className="fz20">
              ￥<span className="number">{transformFenToYuan(commission.totalAmount)}</span>
            </div>
          </Card>
          <Card className="numberItem" headStyle={headStyle}>
            <div className="title">已提现佣金（元）</div>
            <div className="fz20">
              ￥<span className="number">{transformFenToYuan(commission.hasWithdrawalAmount)}</span>
            </div>
          </Card>
        </div>
      </Card>
    );
  };

  const renderIncomeAndExpense = () => {
    const FormList = [
      {
        name: 'type',
        el: (
          <Radio.Group buttonStyle="solid">
            {STATUS.map((v) => (
              <Radio.Button key={v.value} value={v.value}>
                {v.text}
              </Radio.Button>
            ))}
          </Radio.Group>
        ),
      },
      {
        type: 'max31Date',
        name: 'time',
        label: '时间范围',
        elOptions: {
          showTime: true,
          allowClear: true,
        },
      },
    ];
    return (
      <Card title="收支明细" className="mb10" bordered={false}>
        <CustomerForm
          FormList={FormList}
          layout="inline"
          hideButton
          form={form}
          initialValues={INIT_VALUE}
          extra={
            <Form.Item>
              <Button onClick={() => handleSearchForm1()} type="primary" className="ml10">
                查询
              </Button>
              <Button
                type="primary"
                className="ml10"
                onClick={() => {
                  resetForm();
                }}
              >
                重置
              </Button>
            </Form.Item>
          }
        />
        <CustomerTable
          className="mt20"
          size="small"
          rowKey="id"
          loading={loading1}
          data={incomeAndExpense}
          columns={columns1()}
          onTableChange={(res) => handleStandardTableChange(res, 'flow')}
          param={formValues}
        />
      </Card>
    );
  };
  const renderWaitForSettle = () => {
    return (
      <Card title="待结算明细" className="mb10" bordered={false}>
        <CustomerTable
          className="mt20"
          size="small"
          rowKey="id"
          loading={loading2}
          data={waitForSettle}
          columns={columns2()}
          onTableChange={(res) => handleStandardTableChange(res, 'freeze')}
        />
      </Card>
    );
  };

  function loadDetail() {
    dispatch({
      type: actionMap.getDetail,
      payload: {
        captainId: query.id || '',
      },
    });
  }

  function loadCommission() {
    dispatch({
      type: actionMap.getCommission,
      payload: {
        captainId: query.id || '',
      },
    });
  }

  function loadIncomeAndExpense(param) {
    const payload = {
      ...formValues,
      ...param,
    };

    if (!payload.time) {
      delete payload.startTime;
      delete payload.endTime;
    }

    dispatch({
      type: actionMap.getIncomeAndExpense,
      payload,
    });
  }

  function loadWaitForSettle(param) {
    dispatch({
      type: actionMap.getWaitForSettle,
      payload: {
        ...param,
      },
    });
  }

  function resetForm() {
    form.setFieldsValue(INIT_VALUE);
    updateFormValues(INIT_VALUE);
    loadIncomeAndExpense(INIT_VALUE);
  }

  function handleSearchForm1() {
    form.validateFields().then((res) => {
      if (res.time) {
        res.startTime = res.time[0].format('YYYY-MM-DD HH:mm:ss');
        res.endTime = res.time[1]
          .set({ hour: 23, minute: 59, second: 59 })
          .format('YYYY-MM-DD HH:mm:ss');
        delete res.time;
      }
      updateFormValues({ ...formValues, ...res });
      loadIncomeAndExpense({ ...formValues, ...res });
    });
  }

  function updateFormValues(param) {
    setFormValues((pre) => ({ ...pre, ...param }));
  }

  async function handleStandardTableChange(response, type) {
    const {
      pageSizeOptions,
      current,
      total,
      currentPage,
      pageSize,
      showQuickJumper,
      showSizeChanger,
      ...rest
    } = response;
    const params = {
      currentPage: current || currentPage,
      pageSize,
      ...rest,
    };
    if (type === 'flow') {
      updateFormValues(params);
      loadIncomeAndExpense(params);
    } else if (type === 'freeze') {
      loadWaitForSettle(params);
    }
  }

  return (
    <PageHeaderWrapper title="数据看板">
      {renderDetail()}
      {renderCommission()}
      {renderIncomeAndExpense()}
      {renderWaitForSettle()}
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, groupHeader }) => ({
  groupHeader,
  loading1: loading.effects[actionMap.getIncomeAndExpense],
  loading2: loading.effects[actionMap.getWaitForSettle],
}))(Statistics);
