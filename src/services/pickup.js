import request from '@/utils/request';

const ADDRESS_SERVER_ROOT = '/address';
// const ADDRESS_SERVER_ROOT = 'http://apidoc.tradedge.cn/mock/187';

export async function getPickupList(params = {}) {
  return request.post(`${ADDRESS_SERVER_ROOT}/pickup/list`, {
    body: params,
    needData: 2,
  });
}

export async function delPickup(params = {}) {
  return request.post(`${ADDRESS_SERVER_ROOT}/pickup/del`, {
    body: params,
    role: {
      require: ['id'],
    },
  });
}

export async function changePickupStatus(params = {}) {
  return request.post(`${ADDRESS_SERVER_ROOT}/pickup/switch_enable`, {
    body: params,
    role: {
      require: ['id'],
    },
  });
}

export async function getPickupDetail(params = {}) {
  return request.post(`${ADDRESS_SERVER_ROOT}/pickup/detail`, { body: params });
}

export async function addPickup(params = {}) {
  return request.post(`${ADDRESS_SERVER_ROOT}/pickup/create`, { body: params, needData: 2 });
}

export async function editPickup(params = {}) {
  return request.post(`${ADDRESS_SERVER_ROOT}/pickup/update`, {
    body: params,
    needData: 2,
    role: {
      require: ['id'],
    },
  });
}
