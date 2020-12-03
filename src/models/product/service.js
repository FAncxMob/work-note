import request from '@/utils/request';

const router = '/product';
// const router = 'http://apidoc.tradedge.cn/mock/209/supplier';
// 获取list列表
export function geList(data) {
  return request.post(`${router}/product/list`, {
    body: data,
    needData: 2,
  });
}
// 获取商品详情
export function getDetail(data) {
  return request.post(`${router}/product/findById`, {
    body: data,
  });
}
// 删除商品
export function deleteItem(id) {
  return request.post(`${router}/product/delete`, {
    body: { id },
  });
}
// 商品申请上架 ids:[]
export function applyUp(ids) {
  return request.post(`${router}/product/applyshelve`, {
    body: { ids },
  });
}
// 商品下架
export function getDown(id) {
  return request.post(`${router}/product/unshelve`, {
    body: { id },
  });
}
// 新增商品
export function addProduct(data) {
  return request.post(`${router}/product/addBase`, {
    body: data,
    needAuth: 1,
    needData: 2, // 自动获取shopId
  });
}
// 更新商品
export function updateProduct(data) {
  return request.post(`${router}/product/update`, {
    body: data,
  });
}
// 精品商品分类
export function getCategoryList(data) {
  return request.get(`${router}/category/list`, {
    query: data,
    needData: 2,
  });
}
// 获取省市 data:{province:''}
export function getCityData(data) {
  // return request.post('/op_config/shop_city/province_city', {
  //   body: data,
  // });
  return request.post('/opconfig/shop_city/list', {
    body: { currentPage: 1, pageSize: 200 },
  });
}
