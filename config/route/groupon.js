import ROUTE_MAP from '../../src/routeMap';

export default {
  path: ROUTE_MAP.grouponRoot,
  name: 'groupon',
  routes: [
    {
      name: 'grouponList',
      path: ROUTE_MAP.grouponList,
      routes: [
        {
          path: ROUTE_MAP.grouponList,
          component: './Groupon/List',
        },
        {
          name: 'grouponCreate',
          path: ROUTE_MAP.grouponCreate,
          component: './Groupon/Edit/info',
          hideInMenu: true,
        },
        {
          name: 'grouponEdit',
          path: ROUTE_MAP.grouponEdit,
          component: './Groupon/Edit/info',
          hideInMenu: true,
        },
        {
          name: 'grouponProducts',
          path: ROUTE_MAP.grouponProducts,
          component: './Groupon/Edit/Products/Products',
          hideInMenu: true,
        },
        {
          name: 'grouponShareInformation',
          path: ROUTE_MAP.grouponShareInformation,
          component: './Groupon/ShareInformation/ShareInformation',
          hideInMenu: true,
        },
        {
          name: 'salesData',
          path: ROUTE_MAP.grouponSalesData,
          component: './Groupon/Data/Sales',
          hideInMenu: true,
        },
        {
          name: 'productsData',
          path: ROUTE_MAP.grouponProductsData,
          component: './Groupon/Data/Products',
          hideInMenu: true,
        },
        {
          name: 'reportDownload',
          path: ROUTE_MAP.grouponReportDownload,
          component: './Groupon/Data/ReportDownload',
          hideInMenu: true,
        },
        {
          name: 'receiptData',
          path: ROUTE_MAP.grouponReceiptData,
          component: './Groupon/Data/Receipt',
          hideInMenu: true,
        },
        {
          name: 'receiptDetailData',
          path: `${ROUTE_MAP.grouponReceiptDetailData}/:grouponId`,
          component: './Groupon/Data/ReceiptDetail',
          hideInMenu: true,
        },
      ],
    },
  ],
};
