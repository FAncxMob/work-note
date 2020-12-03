import request from '@/utils/request';

export function getSellCategoryData() {
  return request.post(`/product/category/findAllCategory`, {
    needData: 2,
  });
}

export function addSellCategory(params) {
  return request.post(`/product/category/addBatch`, {
    body: params,
  });
}

export function updateSellCategory(params) {
  return request.post(`/product/category/update`, {
    body: params,
    needData: 2,
  });
}

export function deleteSellCategory(params) {
  return request.post(`/product/category/delete`, {
    body: params,
  });
}

/**
 * @deprecated 获取文章列表
 * @param {object} params
 * @param {string} params.currentPage
 * @param {string} params.pageSize
 */
export function getArticleList(params) {
  return request.post(`/op_config/article/mgr_list`, {
    body: params,
  });
}

/**
 * @deprecated 新增文章
 * @param {object} params
 */
export function addArticle(params) {
  return request.post(`/op_config/article/create`, {
    body: params,
  });
}

/**
 * @deprecated 编辑文章
 * @param {object} params
 */
export function editArticle(params) {
  return request.post(`/op_config/article/update`, {
    body: params,
  });
}

/**
 * @deprecated 获取文章
 * @param {object} params
 * @param {object} params.id 文章id
 */
export function getArticle(params) {
  return request.get(`/op_config/article/mgr_detail`, {
    query: params,
  });
}

/**
 * @deprecated 删除文章
 * @param {object} params
 * @param {object} params.id 文章id
 */
export function delArticle(params) {
  return request.get(`/op_config/article/del`, {
    query: params,
  });
}

/**
 * @deprecated 获取申请列表
 * @param {object} params
 * @param {object} params.type
 * @param {object} params.name
 * @param {object} params.mobile
 */
export function getApplyList(params) {
  return request.post(`op_config/user_collect/list`, {
    body: params,
  });
}
