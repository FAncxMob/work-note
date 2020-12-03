import request from '@/utils/request';

/**
 * @deprecated 获取banner列表
 */
export function getBannerList(params) {
  return request.post('/opconfig/banner/list', {
    body: params,
    needData: 2,
  });
}

/**
 * @deprecated 新增banner
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.url
 * @param {string} params.toUrl
 * @param {string} params.linkType
 */
export function addBanner(params) {
  return request.post('/opconfig/banner/add', {
    body: params,
    needData: 2,
  });
}

/**
 * @deprecated 更新banner
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.name
 * @param {string} params.url
 * @param {string} params.toUrl
 * @param {string} params.linkType
 */
export function updateBanner(params) {
  return request.post('/opconfig/banner/update', {
    body: params,
    needData: 2,
  });
}

/**
 * @deprecated banner排序
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.sort 数值越大越靠前

 */
export function sortBanner(params) {
  return request.post('/opconfig/banner/set_sort', {
    body: params,
    needData: 2,
  });
}

/**
 * @deprecated 删除banner
 * @param {object} params
 * @param {string} params.id

 */
export function deleteBanner(params) {
  return request.post('/opconfig/banner/del', {
    body: params,
    needData: 2,
  });
}
