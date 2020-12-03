const Test = [
  {
    path: '/test/canvas',
    component: './Test/Canvas',
    hideInMenu: true,
  },
];
export default {
  path: '/test',
  // redirect:'/productManager/product/list',
  routes: [...Test],
};
