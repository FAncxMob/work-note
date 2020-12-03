import ROUTE_MAP from '../../src/routeMap';

export default {
  path: ROUTE_MAP.designRoot,
  name: 'design',
  routes: [
    {
      name: 'designBlueprintList',
      path: ROUTE_MAP.designBlueprintList,
      routes: [
        {
          path: ROUTE_MAP.designBlueprintList,
          component: './Design/Blueprint/List',
        },
        {
          name: 'designBlueprintDraw',
          path: `${ROUTE_MAP.designBlueprintDraw}/:id`,
          component: './Design/Blueprint/Draw',
          hideInMenu: true,
        },
      ],
    },
  ],
};
