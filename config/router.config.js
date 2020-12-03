import user from './route/user';
import createShop from './route/createShop';
import shop from './route/shop';
import groupon from './route/groupon';
import inductedInfo from './route/inductedInfo';
import wallet from './route/wallet';
import product from './route/product';
import order from './route/order';
import goodsWarehouse from './route/goodsWarehouse';
import expressDelivery from './route/expressDelivery';
import download from './route/download';
import design from './route/design';

import test from './route/test'; // 开发测试使用

export default [
  user, // 登陆 && 注册 && 忘记密码
  createShop,
  inductedInfo, // 信息登记
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/shop/index',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            hideInMenu: true,
            component: './Welcome',
          },
          {
            path: '/test',
            name: 'test',
            hideInMenu: true,
            component: './test/index',
          },
          shop, // 店铺管理
          goodsWarehouse, // 商品库
          groupon, // 团购
          expressDelivery, // 团购
          wallet, // 钱包
          order, // 订单
          product, // 素材库
          download, // 下载文件列表
          design, // 装修
          test, // 测试页面
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
