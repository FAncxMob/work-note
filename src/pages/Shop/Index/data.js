import ROUTE_MAP from '@/routeMap';
// 导航图片

export async function setTips({ authType, authAuditStatus }) {
  try {
    const authMsg = {};
    if (authType === 0) {
      authMsg.msg = '去实名认证';
      authMsg.path = '/shop/credentials/index'; // TODO 实名认证
    } else {
      switch (authAuditStatus) {
        // 审核通过才能设置店铺信息（修改标签）
        case 1:
          authMsg.msg = '店铺审核中';
          authMsg.path = '';
          break;
        case 2:
          authMsg.msg = '审核未通过，去修改认证信息';
          authMsg.path = '/shop/credentials/index'; // TODO 实名认证
          break;
        case 3:
          authMsg.msg = '已认证';
          authMsg.path = '';
          break;
        default:
          break;
      }
    }
    return authMsg;
  } catch (error) {
    this.error(error);
    return {};
  }
}
const groupon = require('@/assets/groupon.png');
const material = require('@/assets/material.png');
const order = require('@/assets/order.png');
const pickup = require('@/assets/pickup.png');
const recommend = require('@/assets/recommend.png');

export const navList = [
  {
    name: '我的团购',
    path: ROUTE_MAP.grouponList,
    img: groupon,
  },
  {
    name: '我的商品库',
    path: '/goodsWarehouse/goodsList/index',
    img: material,
  },
  {
    name: '我的订单',
    path: '/order/List/selfRaising',
    img: order,
  },
  {
    name: '我的自提点',
    path: '/shop/pickuplist/index',
    img: pickup,
  },
  /*   {
    name: '我的推荐',
    path: '/recommend/list',
    img: recommend,
  }, */
];
