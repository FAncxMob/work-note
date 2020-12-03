import request from '@/utils/request';

export function getBaseCategoryList() {
  return request.get(`/product/baseCategory/list`, {
    needData: 2,
  });
}

export function addCategory(params) {
  return request.post(`/product/baseCategory/add`, {
    body: params,
    needData: 2,
  });
}

export function updateCategory(params) {
  return request.post(`/product/baseCategory/update`, {
    body: params,
    needData: 2,
  });
}

export function deleteCategory(params) {
  return request.post(`/product/baseCategory/delete`, {
    body: params,
  });
}

/**
 * @deprecated 获取商品列表
 * @param {object} params
 * @param {string} params.currentPage
 * @param {string} params.pageSize
 */
export function getGoodsList(params) {
  return request.post(`/product/product/listbase2`, {
    body: params,
    needData: 2,
  });
}

/**
 * @deprecated 新增商品
 * @param {object} params
 */
export function addGoods(params) {
  return request.post(`/product/product/addBase`, {
    body: params,
    needData: 2,
  });
}

/**
 * @deprecated 编辑商品
 * @param {object} params
 */
export function editGoods(params) {
  return request.post(`/product/product/updatebase`, {
    body: params,
    needData: 2,
  });
}

/**
 * @deprecated 获取商品
 * @param {object} params
 * @param {object} params.productId 商品id
 */
export function getGoods(params) {
  return request.post(`/product/product/findbasebyid`, {
    body: params,
  });
}

/**
 * @deprecated 删除商品
 * @param {object} params
 * @param {object} params.productId 商品id
 */
export function delGoods(params) {
  return request.post(`/product/product/deletebase`, {
    body: params,
  });
}

/**
 * @deprecated 启售商品
 * @param {object} params
 * @param {object} params.productId 商品id
 */
export function startSale(params) {
  return request.post(`/product/product/startSale`, {
    body: params,
  });
}

/**
 * @deprecated 禁售商品
 * @param {object} params
 * @param {object} params.productId 商品id
 */
export function stopSale(params) {
  return request.post(`/product/product/stopSale`, {
    body: params,
  });
}
