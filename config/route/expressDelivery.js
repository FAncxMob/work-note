import ROUTE_MAP from '../../src/routeMap';

export default {
  name: 'expressDelivery',
  path: ROUTE_MAP.expressDeliveryRoot,
  routes: [
    {
      name: 'expressDeliveryProducts',
      path: ROUTE_MAP.expressDeliveryProducts,
      component: './ExpressDelivery/Products/Products',
    },
    {
      name: 'expressDeliveryTemplate',
      path: ROUTE_MAP.expressDeliveryTemplate,
      component: './ExpressDelivery/Delivery/Template',
    },
  ],
};
