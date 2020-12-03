import request from '@/utils/request';

const BASE_ROUTE = '/captain';
// const ADDRESS_SERVER_ROOT = 'http://apidoc.tradedge.cn/mock/187';

// 团长列表
export async function getGroupHeaderList(params = {}) {
  params = {
    pageSize: 10,
    currentPage: 1,
    ...params,
  };
  return request.post(`${BASE_ROUTE}/captain/list`, {
    body: params,
    needData: 2,
  });
}
// 团长详情
export async function getGroupHeaderDetail(params = {}) {
  return request.post(`${BASE_ROUTE}/captain/detail`, {
    body: params,
    needData: 2,
  });
}
//  佣金信息
export async function getCommission(params = {}) {
  return request.get(`/account/account/amount/data`, {
    query: params,
  });
}
// 收支明细
export async function getIncomeAndExpense(params = {}) {
  return request.get(`/account/account/page/flow`, {
    query: params,
  });
}
// 待结算明细
export async function getWaitForSettle(params = {}) {
  return request.get(`/account/account/page/freeze/detail`, {
    query: params,
  });
}
// 编辑团长详情
export async function updateGroupHeaderDetail(params = {}) {
  return request.post(`${BASE_ROUTE}/captain/update`, {
    body: params,
    needData: 2,
  });
}

// 自提点类型列表
export async function getPickupType(params = {}) {
  return request.get(`${BASE_ROUTE}/captain_type/list`, {
    query: params,
    needData: 2,
  });
}

// 审核
export async function verifyGroupHeader(params = {}) {
  return request.post(`${BASE_ROUTE}/captain/audit`, {
    body: params,
    needData: 2,
  });
}
// 暂停
export async function suspendGroupHeader(params = {}) {
  return request.post(`${BASE_ROUTE}/captain/suspend`, {
    body: params,
    needData: 2,
  });
}
// 禁用
export async function closedGroupHeader(params = {}) {
  return request.post(`${BASE_ROUTE}/captain/closed`, {
    body: params,
    needData: 2,
  });
}
// 启用
export async function openGroupHeader(params = {}) {
  return request.post(`${BASE_ROUTE}/captain/open`, {
    body: params,
    needData: 2,
  });
}
