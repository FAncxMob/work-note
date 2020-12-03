import request from '@/utils/request';

const router = '/opconfig';
// const router = 'http://apidoc.tradedge.cn/mock/209/supplier';
// 获取分类管理list列表
export function getList(data) {
  return request.post(`/product/category/findcategoryproduct`, {
    body: data,
    needData: 2,
  });
}
// 获取常用分类列表
export function getCommonType(data) {
  return request.post(`/opconfig/goods_category/list_by_nextkey`, {
    body: data,
  });
}
// 添加分类
export function addSort(data) {
  return request.post(`/opconfig/goods_category/list_by_nextkey`, {
    body: data,
  });
}
// 编辑分类
export function editSort(data) {
  return request.post(`/opconfig/goods_category/list_by_nextkey`, {
    body: data,
  });
}
