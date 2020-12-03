import ROUTE_MAP from '../../src/routeMap';

export default {
  name: 'captain',
  path: ROUTE_MAP.captainRoot,
  routes: [
    {
      path: ROUTE_MAP.captainRoot,
      redirect: ROUTE_MAP.captainList,
    },
    {
      path: ROUTE_MAP.captainList,
      component: './Captain/List',
    },
    {
      name: 'detail',
      path: ROUTE_MAP.captainDetail,
      component: './Captain/List/Detail',
      hideInMenu: true,
    },
    {
      name: 'statistics',
      path: ROUTE_MAP.captainStatics,
      component: './Captain/List/Statistics',
      hideInMenu: true,
    },
    {
      name: 'edit',
      path: ROUTE_MAP.captainEdit,
      component: './Captain/List/Edit',
      hideInMenu: true,
    },
    {
      name: 'add',
      path: ROUTE_MAP.captainAdd,
      component: './Captain/List/Edit',
      hideInMenu: true,
    },
  ],
};
