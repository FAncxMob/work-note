import request from '@/utils/request';

const BASE_ROUTE = '/shop';

function createShop(data) {
  return request.post(`${BASE_ROUTE}/shop/create`, {
    body: data,
    role: {
      require: [
        'area',
        'city',
        'contactMobile',
        'detail',
        'isGlobalEnabled',
        'isGroup',
        'isLocalEnabled',
        'lat',
        'lng',
        'name',
        'province',
        'shopLogo',
      ],
    },
  });
}

async function findShopInfoByToken(data) {
  return request.post(`${BASE_ROUTE}/shop/findShopInfoByToken`, { body: data });
}

/**
 * 修改店铺基本信息
 * @param {*} data
 * @param id 店铺id
 * @param userId  用户id
 * @param name  店铺名称
 * @param shopLogo  店铺logo
 * @param contactMobile 联系人电话
 * @param isLocalEnabled 是否本地店 0 否
 * @param isGlobalEnabled 是否全国点 0 否
 * @param tags  标签 “，”分隔
 * @param description 描述
 * @param weChatQrCode 微信二维码
 */
function editShop(data) {
  return request.post(`${BASE_ROUTE}/shop/updateBasicInfo`, {
    body: data,
    needData: 1,
    role: {
      require: [
        'area',
        'city',
        'contactMobile',
        'detail',
        'isGlobalEnabled',
        'isGroup',
        'isLocalEnabled',
        'lat',
        'lng',
        'name',
        'province',
        'shopLogo',
      ],
    },
  });
}

/**
 * 店铺经营类目标签列表
 * @param {*} data
 * @param pageSize 每页条数
 * @param nextKey 分页条件
 * @param includeShopCategoryIdArray 包含的经营类目ID数组 (只用传二级经营类目id)
 * @param excludeCategoryTagNameArray 不包含的标签名称数组 没有传[]
 */
// 店铺标签
export async function getTags(params = {}) {
  params.pageSize = 999;
  params.excludeCategoryTagNameArray = [];
  return request.post('opconfig/shop_category_tag/list_by_nextkey', {
    body: params,
    needData: 1,
  });
}

/**
 * 提交审核信息
 * @param {*} data
 * @param id 店铺id
 * @param firstBizcatId  一级经营类目
 * @param secondsBizcatId  二级经营类目
 * @param authType 经营类型1：个人 2个体工商户3企业
 * @param photoBox 认证图片
 */
function credentials(data) {
  return request.post(`${BASE_ROUTE}auth/saveRequest`, {
    body: data,
    needData: 1,
    role: { require: ['authType', 'firstBizcatId', 'secondsBizcatId'] },
  });
}

/**
 * 获取审核信息
 * @param {*} data
 * @param id 店铺id
 * @param authType 经营类型1：个人 2个体工商户3企业
 */
function findRequest(data) {
  return request.post(`${BASE_ROUTE}auth/findRequest`, { body: data, needData: 1 });
}

/**
 * 根据父经营类目Id查询子类目列表
 * @param {*} data
 * @param parentCategoryId 父经营类目Id
 */
async function getCategory(data) {
  return request.post('opconfig/shop_category/list_by_parent_categoryid', {
    body: data,
    role: { require: ['parentCategoryId'] },
  });
}

/**
 * 获取店铺今日相关数据
 * @param shopId
 */
async function getShopTodaySta() {
  return request.get('statistics/shop/today/sta', { needData: 2 });
}

export default {
  createShop,
  findShopInfoByToken,
  editShop,
  credentials,
  getCategory,
  getTags,
  findRequest,
  getShopTodaySta,
};
