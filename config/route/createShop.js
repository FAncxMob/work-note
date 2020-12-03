export default {
  path: '/createShop',
  component: '../layouts/BackGroundLayout',
  routes: [
    {
      path: '/createShop',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          name: 'createShop',
          path: '/createShop/index',
          component: './Shop/CreateShop',
        },
      ],
    },
  ],
};
