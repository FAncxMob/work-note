import ROUTE_MAP from '../../src/routeMap';
import captain from './captain';

const Shop = [
  {
    path: ROUTE_MAP.shopIndex,
    name: 'index',
    component: './Shop/Index/index',
    // routes: [
    //   {
    //     path: ROUTE_MAP.shopEdit,
    //     name: 'edit',
    //     component: './Shop/EditShop/index',
    //     // hideInMenu: true,
    //   },
    // ],
  },
  {
    path: ROUTE_MAP.shopEdit,
    name: 'edit',
    component: './Shop/EditShop/index',
    hideInMenu: true,
  },
  {
    name: 'pickList',
    path: ROUTE_MAP.pickupListRoot,
    routes: [
      {
        path: ROUTE_MAP.pickupListRoot,
        redirect: ROUTE_MAP.pickupList,
      },
      {
        path: ROUTE_MAP.pickupList,
        component: './Pickup/List',
      },
      {
        path: ROUTE_MAP.pickupAdd,
        name: 'add',
        component: './Pickup/Detail',
        hideInMenu: true,
      },
      {
        path: ROUTE_MAP.pickupEdit,
        name: 'edit',
        component: './Pickup/Detail',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'banner',
    path: ROUTE_MAP.bannerListRoot,
    routes: [
      {
        path: ROUTE_MAP.bannerListRoot,
        redirect: ROUTE_MAP.bannerList,
      },
      {
        path: ROUTE_MAP.bannerList,
        component: './Banner/List',
      },
      {
        path: ROUTE_MAP.bannerEdit,
        name: 'edit',
        component: './GoodsWarehouse/GoodsEdit',
        hideInMenu: true,
      },
      {
        path: ROUTE_MAP.bannerAdd,
        name: 'add',
        component: './GoodsWarehouse/GoodsEdit',
        hideInMenu: true,
      },
    ],
  },
  captain,
  {
    name: 'sellCategory',
    path: ROUTE_MAP.sellCategory,
    component: './SellCategory/index',
  },
];
export default {
  path: ROUTE_MAP.shopRoot,
  name: 'shop',
  routes: [...Shop],
};
