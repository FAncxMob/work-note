import ROUTE_MAP from '../../src/routeMap';

const GoodsWarehouse = [
  {
    name: 'goods',
    path: ROUTE_MAP.goodsWarehouseGoodsListRoot,
    routes: [
      {
        path: ROUTE_MAP.goodsWarehouseGoodsListRoot,
        redirect: ROUTE_MAP.goodsWarehouseGoodsList,
      },
      {
        path: ROUTE_MAP.goodsWarehouseGoodsList,
        component: './GoodsWarehouse/GoodsList',
      },
      {
        path: ROUTE_MAP.goodsWarehouseEditGoods,
        name: 'editGoods',
        component: './GoodsWarehouse/GoodsEdit',
        hideInMenu: true,
      },
      {
        path: ROUTE_MAP.goodsWarehouseAddGoods,
        name: 'addGoods',
        component: './GoodsWarehouse/GoodsEdit',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'category',
    path: ROUTE_MAP.goodsWarehouseCategoryList,
    component: './GoodsWarehouse/Category',
  },
];
export default {
  path: ROUTE_MAP.goodsWarehouseRoot,
  name: 'goodsWarehouse',
  routes: [...GoodsWarehouse],
};
