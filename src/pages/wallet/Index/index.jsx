import React from 'react';
import { Button, Radio, Form, Card, Popover, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerTable from '@/components/CustomerTable/indexNoLoc.jsx';
import CustomerForm from '@/components/CustomerForm/index.jsx';
import { transformFenToYuan } from '@/models/wallet/utils';
import shop from '@/customizeModel/Shop/Shop';
import ApplyModal from './ApplyModal/Bank';

import { formList, totalColumns, frozenColumns, popContent } from './data.js';

const initValue = {
  time: '',
  type: '', // 收入支出
};

@connect(({ walletModel, bankModel, loading }) => ({
  walletModel,
  bankModel,
  loading,
}))
class WalletIndex extends React.Component {
  formRef = React.createRef();

  state = {
    searchValues: {},
    applyVisible: false,
    initialValues: { ...initValue },
    detailType: 'total', // total总资金明细   frozen  冻结资金明细
    currentPageState: {
      // 储存各自的currentPage
      total: 1,
      frozen: 1,
    },
  };

  UNSAFE_componentWillMount() {
    this.getAccountInfo();
    this.load();
  }

  load = () => {
    const { dispatch } = this.props;
    const { detailType, searchValues } = this.state;
    const params = { ...searchValues };
    if (searchValues.time) {
      const [f, s] = searchValues.time;
      params.startTime = f.valueOf();
      params.endTime = s.set({ hour: 23, minute: 59, second: 59 }).valueOf();
      delete params.time;
    }
    dispatch({
      type: `walletModel/${detailType === 'frozen' ? 'getFrozenList' : 'getFundList'}`,
      payload: params,
    });
  };

  // 获取账户余额 冻结金额
  getAccountInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `walletModel/getWalletInfo`,
    });
  };

  // TODO 去认证
  handleToAuth = () => {
    message.warning('功能开发中...');
    // history.push('/shop/credentials/index');
  };

  // 申请提现
  handleApply = async () => {
    const auth = await shop.getAuth();
    if (Number(auth) === 0) {
      return message.warning('实名认证后才能提现');
      /*  TODO
      return Modal.confirm({
        title: '提醒',
        icon: <ExclamationCircleOutlined />,
        content: '实名认证后才能提现',
        okText: '去认证',
        cancelText: '取消',
        onOk: this.handleToAuth,
      }); */
    }
    if (Number(auth) === 1) return message.warning('店铺审核中，请稍后再试');
    return this.changeApplyVisible(true);
  };

  // 关闭提现modal
  closeApplyModal = () => {
    this.changeApplyVisible(false);
  };

  changeApplyVisible = (v) => {
    this.getAccountInfo();
    this.setState({
      applyVisible: v,
    });
  };

  // s搜索重置
  handleFormReset = () => {
    const param = { ...initValue };
    this.formRef.current.setFieldsValue({ ...param });
    this.resetForm(param);
  };

  resetForm = async (res) => {
    const param = {
      ...res,
      currentPage: 1,
    };
    await this.setState((pre) => ({
      searchValues: { ...pre.searchValues, ...param },
    }));
    this.load();
  };

  handleSearch = () => {
    this.formRef.current.validateFields().then((res) => {
      this.resetForm(res);
    });
  };

  handleStandardTableChange = async (response) => {
    const { pageSizeOptions, current, total, currentPage, pageSize, ...rest } = response;
    const params = {
      currentPage: current || currentPage,
      pageSize,
      ...rest,
    };
    const { detailType } = this.state;
    await this.setState((pre) => ({
      searchValues: { ...params },
      currentPageState: { ...pre.currentPageState, [detailType]: params.currentPage },
    }));
    this.load();
  };

  // 切换资金明细或者冻结资金明细(页数置1， 类型隐藏)
  handleDetailType = async (e) => {
    const val = e.target.value;
    const { currentPageState } = this.state;
    // 切换冻结还是资金的时候需要更改currentPage
    await this.setState((pre) => ({
      searchValues: { ...pre.searchValues, currentPage: currentPageState[val] },
      detailType: val,
    }));
    this.load();
  };

  // 搜索表单
  renderForm = (detailType) => {
    return (
      <CustomerForm
        FormList={formList(detailType)}
        layout="inline"
        hideButton
        initialValues={this.state.initialValues}
        formRef={this.formRef}
        extra={
          <Form.Item>
            <Button onClick={this.handleFormReset}>重置</Button>
            <Button type="primary" className="ml10" onClick={this.handleSearch}>
              查询
            </Button>
          </Form.Item>
        }
      />
    );
  };

  render() {
    const {
      walletModel: { walletInfo, fundListData, frozenListData },
      bankModel,
      dispatch,
      loading,
    } = this.props;
    const { detailType, applyVisible } = this.state;
    return (
      <PageHeaderWrapper title="账户信息">
        <Card className="mb10" title="">
          <Radio.Group value={detailType} onChange={this.handleDetailType} optionType="button">
            <Radio.Button value="total">资金明细</Radio.Button>
            <Radio.Button value="frozen">冻结明细</Radio.Button>
          </Radio.Group>
          <div className="dib ml30">
            账户余额:
            <span className="fwb mr10 fz30">￥{transformFenToYuan(walletInfo.totalAmount)}</span>
            <span>
              (<span className="colorBlue">{transformFenToYuan(walletInfo.lockAmount)}</span>
              <span className="text-info">不可用</span>)
              <Popover content={popContent} trigger="hover">
                <ExclamationCircleOutlined className="text-warning mr3 ml3" />
              </Popover>
            </span>
            <Button className="ml60" type="primary" onClick={this.handleApply}>
              提现
            </Button>
          </div>
        </Card>
        <Card /* title={this.renderForm(detailType)} */>
          <CustomerTable
            style={{ display: detailType === 'total' ? '' : 'none' }}
            rowKey="id"
            loading={loading.effects['walletModel/getFundList']}
            data={fundListData}
            columns={totalColumns()}
            onTableChange={this.handleStandardTableChange}
            scroll={{ x: 1000 }}
            size="small"
          />
          <CustomerTable
            style={{ display: detailType === 'frozen' ? '' : 'none' }}
            rowKey="id"
            loading={loading.effects['walletModel/getFrozenList']}
            data={frozenListData}
            columns={frozenColumns()}
            onTableChange={this.handleStandardTableChange}
            scroll={{ x: 1000 }}
            size="small"
          />
        </Card>
        {applyVisible ? (
          <ApplyModal
            visible={applyVisible}
            dispatch={dispatch}
            walletInfo={walletInfo}
            bankModel={bankModel}
            closeModal={this.closeApplyModal}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}
export default WalletIndex;
