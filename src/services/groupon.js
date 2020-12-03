import request from '@/utils/request';

const BASE_ROUTE = 'cgb/groupbuying';

// function getGrouponList(params = {}) {
//   params = {
//     pageSize: 10,
//     currentPage: 1,
//     ...params,
//   };
//   return request.post('http://apidoc.tradedge.cn/mock/198/groupbuying/web/findList', {
//     body: params,
//   });
// }

function getGrouponList(params = {}) {
  params = {
    pageSize: 10,
    currentPage: 1,
    ...params,
  };
  return request.get(`${BASE_ROUTE}/web/findList4PC`, {
    query: params,
    needData: 2,
  });
}

function create(params = {}) {
  delete params.type;
  return request.post(`${BASE_ROUTE}/create4New`, {
    body: params,
    needData: 2,
  });
}

function update(params = {}) {
  delete params.type;
  return request.post(`${BASE_ROUTE}/update4New`, {
    body: params,
    needData: 2,
  });
}

function onActions(params) {
  const { type } = params;
  let path = 'copy4New';
  if (type !== 'copy') {
    path = 'save_group_status';
    params.status = type;
  }
  delete params.type;
  return request.post(`${BASE_ROUTE}/${path}`, {
    body: params,
    needData: 2,
  });
}

function getGroupInfo(params) {
  return request.get(`${BASE_ROUTE}/findDetailInfo4New`, {
    query: params,
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

function findNoticeInfo(params = {}) {
  return request.get(`${BASE_ROUTE}/findNoticeInfo`, {
    query: params,
  });
}

function saveNoticeInfo(payload = {}) {
  return request.post(`${BASE_ROUTE}/notice/save`, {
    body: payload,
  });
}

export default {
  getGrouponList,
  create,
  update,
  onActions,
  getGroupInfo,
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
  findNoticeInfo,
  saveNoticeInfo,
};
