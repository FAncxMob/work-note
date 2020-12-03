export default {
  path: '/wallet',
  name: 'wallet',
  routes: [
    {
      name: 'walletIndex',
      path: '/wallet/index',
      component: './Wallet/Index/index',
    },
    {
      name: 'bankList',
      path: '/wallet/bankList',
      component: './Wallet/Bank/List/index',
    },
  ],
};
