import React from 'react';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Popconfirm } from 'antd';
import { encryptCard, encryptName } from '@/models/wallet/utils';
import EditModal from './EditModal.jsx';

@connect(({ loading, bankModel }) => ({
  bankModel,
  loading,
}))
class BankList extends React.Component {
  state = {
    editVisible: false,
  };

  UNSAFE_componentWillMount() {
    this.load();
  }

  // 加载列表
  load = async () => {
    this.props.dispatch({
      type: 'bankModel/getList',
      payload: {},
    });
  };

  // 新增银行卡
  handleAdd = () => {
    this.setState({ editVisible: true });
  };

  //  删除银行卡
  handleRemove = (id) => {
    this.props.dispatch({
      type: 'bankModel/delBank',
      payload: { id },
    });
  };

  // 关闭编辑弹窗
  closeEditModal = () => {
    this.setState({
      editVisible: false,
    });
  };

  render() {
    const { bankModel, dispatch, loading } = this.props;
    const { editVisible } = this.state;
    const listLoading = loading.effects['bankModel/getBankList'];
    const { bankList } = bankModel;
    return (
      <PageHeaderWrapper title="银行卡管理">
        <Button type="primary" className="mb10" onClick={this.handleAdd}>
          添加银行卡
        </Button>
        <div className="df flex-wrap">
          {bankList.length === 0 && !listLoading ? (
            <div className="text-center mt50">暂无银行卡</div>
          ) : (
            bankList.map((item) => (
              <Card
                className="m10 fx1 max-w300"
                title={item.isPrivate ? '个人账户' : item.name}
                key={item.id}
                extra={
                  <Popconfirm
                    title="您确定要删除该商品标签吗?"
                    onConfirm={() => this.handleRemove(item.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a className="icon">删除</a>
                  </Popconfirm>
                }
              >
                <p className="text-nowrap">银行卡号：{encryptCard(item.cardNo)}</p>
                <p className="text-nowrap">
                  收款人：{item.isPrivate ? encryptName(item.owner) : item.owner}
                </p>
              </Card>
            ))
          )}
        </div>
        {editVisible ? (
          <EditModal
            visible={editVisible}
            bankModel={bankModel}
            dispatch={dispatch}
            closeModal={this.closeEditModal}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}
export default BankList;
