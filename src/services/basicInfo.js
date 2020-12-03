import request from '@/utils/request';

/**
 * @deprecated 根据父经营类目Id查询子类目列表
 * @param {object} params
 * @param {string} params.shopCategoryId 父经营类目Id
 */
export function queryCategory(params) {
  const { parentCategoryId } = params;
  return request.post('/op_config/shop_category/list_by_parent_categoryid', {
    body: { parentCategoryId },
  });
}

/**
 * @deprecated 新增店铺经营类目
 * @param {object} params
 * @param {string} params.parentCategoryId 父经营类目Id
 * @param {string} params.shopCategoryName 新增类目名称
 * @param {array} params.materials 店铺认证资料
 */
export function onCategoryAdd(params) {
  return request.post('/op_config/shop_category/add', {
    body: params,
  });
}

/**
 * @deprecated 修改店铺经营类目
 * @param {object} params
 * @param {string} params.shopCategoryId 经营类目Id
 * @param {string} params.shopCategoryName 新增类目名称
 * @param {array} params.materials 店铺认证资料
 */
export function onCategoryUpdate(params) {
  return request.post('/op_config/shop_category/update', {
    body: params,
  });
}

/**
 * @deprecated 删除店铺经营类目
 * @param {object} params
 * @param {string} params.shopCategoryId 经营类目Id
 */
export function onCategoryDel(params) {
  return request.post('/op_config/shop_category/del', {
    body: params,
  });
}

export function queryMaterials(params) {
  return request.post('/op_config/shop_category_materials/list', {
    body: params,
  });
}

/**
 * @deprecated 查询店铺标签
 * @param {object} params
 * @param {string} params.name 店铺标签名称
 */
export function getShopLabelData(params = {}) {
  return request.post('/op_config/shop_category_tag/list', {
    body: params,
  });
}

/**
 * @deprecated 添加店铺标签
 * @param {object} params
 * @param {string} params.shopCategoryId 店铺经营类目ID
 * @param {array} params.categoryTagNameArray 标签名称,数组
 */
export function saveShopLabel(params) {
  return request.post(`/op_config/shop_category_tag/batch_add`, {
    body: params,
  });
}

/**
 * @deprecated 更新店铺标签
 * @param {object} params
 * @param {string} params.shopCategoryTagId 店铺标签名称
 * @param {string} params.categoryTagName 经营类目
 */
export function updateShopLabel(params) {
  return request.post(`/op_config/shop_category_tag/update`, {
    body: params,
  });
}

/**
 * @deprecated 删除店铺标签
 * @param {object} params
 * @param {string} params.id 店铺标签id
 */
export function deleteShopLabel(params) {
  return request.post(`/op_config/shop_category_tag/del`, {
    body: params,
  });
}

/**
 * @deprecated 查询推荐商品标签
 * @param {object} params.currentPage 当前页
 * @param {object} params.pageSize 每页条数
 * @param {string} params.goodsTagName 商品标签名称
 */
export function getRecommendProductLabelData(params) {
  return request.post(`/op_config/goods_tag/list`, {
    body: params,
  });
}

/**
 * @deprecated 添加/更新推荐商品标签（批量添加以，隔开）
 * @param {object} params
 * @param {string} params.goodsTagId 商品id (编辑才需要id)
 * @param {string} params.goodsTagName 商品标签名称
 */
export function saveRecommendProductLabel(params) {
  return request.post(`/op_config/goods_tag/save`, {
    body: params,
  });
}

/**
 * @deprecated 删除推荐商品标签
 * @param {object} params
 * @param {string} params.goodsTagId 商品id
 */
export function deleteRecommendProductLabel(params) {
  return request.post(`/op_config/goods_tag/del`, {
    body: params,
  });
}

/**
 * @deprecated 查询推荐商品分类
 * @param {object} params.currentPage 当前页
 * @param {object} params.pageSize 每页条数
 * @param {string} params.goodsCategoryName 分类名称
 */
export function getRecommendProductClassData(params) {
  return request.post(`/op_config/goods_category/list`, {
    body: params,
  });
}

/**
 * @deprecated 添加/更新推荐商品分类（批量添加以，隔开）
 * @param {object} params
 * @param {string} params.goodsCategoryId 分类id
 * @param {string} params.goodsCategoryName 分类名称
 */
export function saveRecommendProductClass(params) {
  return request.post(`/op_config/goods_category/save`, {
    body: params,
  });
}

/**
 * @deprecated 删除推荐商品标签
 * @param {object} params
 * @param {string} params.goodsCategoryId 分类id
 */
export function deleteRecommendProductClass(params) {
  return request.post(`/op_config/goods_category/del`, {
    body: params,
  });
}
