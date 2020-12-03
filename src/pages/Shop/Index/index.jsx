import React from 'react';
import { Button, Card, Avatar, message } from 'antd';
import { connect, history } from 'umi';
import { FormOutlined, UserOutlined } from '@ant-design/icons';
import UFF from '@/utils/UFF';
import shop from '@/customizeModel/Shop/Shop';
import moment from 'moment';
import ROUTE_MAP from '@/routeMap';
import { setTips, navList } from './data.js';

/* @connect(({ shopModel, loading }) => ({
  shopModel,
  loading,
})) */
@connect(({ walletModel, groupon, loading }) => ({
  walletModel,
  groupon,
  loading,
}))
class Index extends React.Component {
  state = {
    shopInfo: {},
    hasEditShopInfo: true,
    shopTodaySta: {},
    tips: {},
  };

  UNSAFE_componentWillMount() {
    this.load();
  }

  load = async () => {
    // 账户信息
    this.props.dispatch({
      type: 'walletModel/getWalletInfo',
    });
    // 团购列表
    this.props.dispatch({
      type: 'groupon/queryGrouponList',
      payload: { currentPage: 1, pageSize: 5 },
    });
    const shopInfo = (await shop.getShopInfo()) || {};
    const shopTodaySta = (await shop.getShopTodaySta()) || {};
    const hasEditShopInfo = (await shop.hasEditShopInfo()) || {};
    const tips = await setTips(shopInfo);
    this.setState({ shopInfo, hasEditShopInfo, shopTodaySta, tips });
  };

  // 跳转链接
  handleToPage = (path, isExist) => {
    if (isExist) return message.warning('功能开发中...');
    return history.push(path);
  };

  render() {
    // const { shopInfo, shopTodaySta, tips } = this.props.shopModel;
    const { walletInfo } = this.props.walletModel;
    const { grouponList } = this.props.groupon;
    const { shopInfo, hasEditShopInfo, shopTodaySta, tips } = this.state;
    const { authAuditStatus } = shopInfo;
    const { msg, path } = tips;
    return (
      <>
        <Card title="我的店铺" className="mb20">
          <div className="df">
            <div className="df align-center mr20">
              {shopInfo.shopLogo ? (
                <Avatar size={80} src={UFF.getShopGroupLogo(shopInfo.shopLogo)} />
              ) : (
                <Avatar size={64} icon={<UserOutlined />} />
              )}
              <div className="ml10">
                <p>
                  {shopInfo.name}
                  {/*  店铺编辑 */}
                  <Button type="link" onClick={() => this.handleToPage('/shop/index/edit')}>
                    <FormOutlined />
                  </Button>
                </p>
                {/* {Number(authAuditStatus) === 3 && !hasEditShopInfo ? (
                  <a onClick={() => this.handleToPage('', true)}>去完善信息，增加曝光量</a>
                ) : null} */}
                <div>
                  {path ? (
                    <Button type="primary" ghost onClick={() => this.handleToPage(path, true)}>
                      {msg}
                    </Button>
                  ) : null}
                  {/* 仅提示 */}
                  {msg && !path ? (
                    <span className="border-blue text-blue p2 pl10 pr10">{msg}</span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="fx1 df justify-around text-center fz18 fwb">
              <div>
                <p>今日销售额</p>
                <p>{shopTodaySta.todayGmv || 0}</p>
              </div>
              <div>
                <p>今日订单数</p>
                <p>{shopTodaySta.todayCnt || 0}</p>
              </div>
              <div>
                <p>今日访问次数</p>
                <p>{shopTodaySta.todayPvCnt || 0}</p>
              </div>
            </div>
          </div>
        </Card>
        <div className="df mb20">
          <Card
            title="账户"
            extra={<a onClick={() => this.handleToPage('/wallet/index')}>查看</a>}
            className="mr20  min-w300"
          >
            <p className="fz16 fwb">
              {' '}
              余额：<span className="fz20">￥{walletInfo.totalAmountInYuan}</span> 元
            </p>
            <p className="fz16">
              冻结金额：<span className="text-info">{walletInfo.lockAmountInYuan} 元</span>
            </p>
          </Card>
          <Card
            title="团购列表"
            extra={<a onClick={() => this.handleToPage(ROUTE_MAP.grouponList)}>更多</a>}
            className="fx1 w0"
          >
            <div className="mb-10">
              {!grouponList.list || !grouponList.list.length ? (
                <div className="mt20 text-center">暂无数据</div>
              ) : (
                grouponList.list.slice(0, 5).map((v, i) => (
                  <div
                    className="df w100p justify-between min-w100 mb10 text-black text-center"
                    key={i}
                    onClick={() => this.handleToPage(ROUTE_MAP.grouponList)}
                  >
                    <span className="text-ellipsis">{v.name}</span>
                    <span className="text-nowrap shrink-0">{`${moment(v.startTime).format(
                      'YYYY-MM-DD HH:mm',
                    )} ~ ${moment(v.endTime).format('YYYY-MM-DD HH:mm')}`}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
        <Card title="快捷导航" className="fx1">
          <div className="df flex-wrap fz16">
            {navList.map((v, i) => (
              <a
                className="db fx1 min-w100 mb20 text-black max-w300 text-center"
                key={i}
                onClick={() => this.handleToPage(v.path)}
              >
                <img src={v.img} alt="" className=" h55" />
                <p className="mt10 mb10">{v.name}</p>
              </a>
            ))}
          </div>
        </Card>
      </>
    );
  }
}

export default Index;
