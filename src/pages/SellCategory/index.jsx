import React from 'react';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, message, Popconfirm, Spin, Empty, Image } from 'antd';

import UFF from '@/utils/UFF';
import shop from '@/customizeModel/Shop/Shop';
import config from '../../../app/config';
import EditAndAddModal from './EditAndAddModal';
import PatchAddModal from '../GoodsWarehouse/Category/PatchAddModal.jsx';
import styles from './index.less';

const { defaultImg } = config;

const ACTION = {
  getList: 'sellCategory/getList',
  delete: 'sellCategory/delete',
  update: 'sellCategory/update',
  add: 'sellCategory/add',
};

class Category extends React.Component {
  state = {
    visible: false,
    addVisible: false,
    title: '',
    initValue: {},
  };

  componentDidMount() {
    this.load();
  }

  setVisible(visible) {
    this.setState({ visible });
  }

  setAddVisible(addVisible) {
    this.setState({ addVisible });
  }

  async load() {
    this.props.dispatch({
      type: ACTION.getList,
      payload: {},
    });
  }

  handleDelete(id) {
    this.props.dispatch({
      type: ACTION.delete,
      payload: { id },
      callback: () => this.load(),
    });
    message.success('删除成功');
  }

  handleDoSth(item = '') {
    if (!item) {
      this.setState({ visible: true, title: '添加销售分类', initValue: {} });
    } else {
      this.setState({ visible: true, title: '编辑销售分类', initValue: item });
    }
  }

  tagItem(item) {
    return (
      <div key={item.id} className="p5">
        <div className={styles.item}>
          <Image
            src={UFF.getProductImage(item.image || defaultImg)}
            alt="img"
            className="w120 h120 bdr5 ofh border-base-dashed mb5"
          />
          <div>{item.name}</div>
          <div className="df justify-around mt5">
            <a onClick={() => this.handleDoSth(item)} className="icon">
              编辑
            </a>
            {item.isDefault ? null : (
              <Popconfirm
                title="您确定要删除该分类吗?"
                onConfirm={() => this.handleDelete(item.id)}
                okText="确定"
                cancelText="取消"
              >
                <a className="icon">删除</a>
              </Popconfirm>
            )}
          </div>
        </div>
      </div>
    );
  }

  async patchAddCallback(correctTags) {
    try {
      const id = await shop.getShopId();
      const arr = [];
      correctTags.map((name) => {
        return arr.push({ name, image: 'https://image.tradedge.cn/defaultGoods.png', shopId: id });
      });
      this.props.dispatch({
        type: 'sellCategory/add',
        payload: arr,
        callback: () => {
          message.success('添加成功');
          this.load();
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  renderTags() {
    const { list, loading } = this.props.sellCategory;
    return (
      <>
        {/* 转圈圈 */}
        {loading && list.length === 0 ? (
          <Spin className="margin-auto w100p" spinning={loading} />
        ) : null}
        {/* 无数据 */}
        {list.length === 0 && !loading ? <Empty className="margin-auto w100p" /> : null}
        {list.length !== 0 ? list.map((tag) => this.tagItem(tag)) : null}
      </>
    );
  }

  render() {
    const { initValue, title, visible, addVisible } = this.state;
    return (
      <PageHeaderWrapper title="销售分类">
        <Card
          title={
            <>
              <Button onClick={() => this.handleDoSth()} className="mr20" type="primary">
                添加销售分类
              </Button>
              <Button onClick={() => this.setAddVisible(true)} type="primary">
                批量添加销售分类
              </Button>
            </>
          }
        >
          <div className="df flex-wrap justify-between">
            {this.renderTags()}
            {new Array(20).fill('').map((v, i) => (
              <div key={i} className="h0 w164" />
            ))}
          </div>
        </Card>
        <EditAndAddModal
          initValues={initValue}
          onOk={() => this.load()}
          title={title}
          setVisible={() => this.setVisible()}
          visible={visible}
        />
        <PatchAddModal
          keyword="销售分类"
          onOk={(correctTags) => this.patchAddCallback(correctTags)}
          title="批量添加分类"
          setVisible={() => this.setAddVisible()}
          visible={addVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ sellCategory, loading }) => ({
  sellCategory,
  loading: loading.models.sellCategory,
}))(Category);
