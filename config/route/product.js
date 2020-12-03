const Product = [
  {
    name: 'productList',
    path: '/productManager/product/list',
    component: './ProductManager/Product/List',
  },
  {
    name: 'productDetail',
    path: '/productManager/product/list/detail',
    component: './ProductManager/Product/Detail',
    hideInMenu: true,
  },
  {
    name: 'productSorts',
    path: '/productManager/product/sorts',
    component: './ProductManager/Sorts',
  },
];
export default {
  path: '/productManager',
  name: 'product',
  // redirect:'/productManager/product/list',
  routes: [...Product],
};
