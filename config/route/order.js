const Order = [
  {
    name: 'selfRaisingOrderList',
    path: '/order/list/selfRaising',
    component: './Order/List/selfRaising',
  },
  {
    name: 'expressOrderList',
    path: '/order/list/express',
    component: './Order/List/express',
  },
  {
    name: 'refundOrderList',
    path: '/order/list/refund',
    component: './Order/List/refund',
  },
  {
    name: 'orderDetail',
    path: '/order/detail',
    component: './Order/Detail',
    hideInMenu: true,
  },
];
export default {
  path: '/order',
  name: 'order',
  routes: [...Order],
};
