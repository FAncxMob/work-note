import ROUTE_MAP from '../../src/routeMap';

export default {
  path: ROUTE_MAP.downloadRoot,
  name: 'download',
  routes: [
    {
      name: 'downloadList',
      path: ROUTE_MAP.downloadList,
      routes: [
        {
          path: ROUTE_MAP.downloadList,
          component: './Download/List',
        },
      ],
    },
  ],
};
