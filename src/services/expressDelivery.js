import request from '@/utils/request';

const BASE_ROUTE = 'cgb/groupbuying';

function getGrouponInfo(params = {}) {
  return request.get(`${BASE_ROUTE}/findExpressGroup`, {
    query: params,
    needData: 2,
  });
}

function changeGrouponStatus(params = {}) {
  return request.post(`${BASE_ROUTE}/changeStatus`, {
    body: params,
  });
}

function getBaseCategory() {
  return request.get('/product/baseCategory/list', {
    needData: 2,
  });
}

function getCategoryProducts(params = {}) {
  params.pageSize = 1000; // 前端不能分页，需写死
  return request.post('/product/product/categoryProducts', {
    body: params,
  });
}

function getProducts(params = {}) {
  return request.post('/product/product/querybase', {
    body: params,
    needData: 2,
  });
}

function onAddProduct(params = {}) {
  return request.post('/product/product/add', {
    body: params,
    needData: 2,
  });
}

function onUpdateProduct(params = {}) {
  return request.post('/product/product/update', {
    body: params,
    needData: 2,
  });
}

function onDeleteProduct(params = {}) {
  return request.post('/product/product/delete', {
    body: params,
    needData: 2,
  });
}

function addCategory(params = {}) {
  return request.post('/product/groupbuy/category/add', {
    body: params,
    needData: 2,
  });
}

function delCategory(params = {}) {
  return request.post('/product/groupbuy/category/delete', {
    body: params,
  });
}

function sortCategory(params = {}) {
  return request.post('/product/groupbuy/category/sort', {
    body: params,
  });
}
function sortProducts(params = {}) {
  return request.post('/product/groupbuy/category/sortProducts', {
    body: params,
  });
}

export default {
  getGrouponInfo,
  changeGrouponStatus,
  getBaseCategory,
  getProducts,
  getCategoryProducts,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  addCategory,
  delCategory,
  sortCategory,
  sortProducts,
};
