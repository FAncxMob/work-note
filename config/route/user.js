export default {
  path: '/user',
  component: '../layouts/UserLayout',
  routes: [
    {
      name: 'register',
      path: '/user/register',
      component: './user/login/register',
    },
    {
      name: 'login',
      path: '/user/login',
      component: './user/login',
    },
    {
      name: 'forget',
      path: '/user/resetPassword',
      component: './user/login/resetPassword',
    },
    {
      name: 'transitLogin',
      path: '/user/transit',
      component: './user/login/transit',
    },
  ],
};
