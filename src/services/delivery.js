import request from '@/utils/request';

export async function getList(params = {}) {
  return request.get('/express/temp/findByShopId', {
    needData: 2,
  });
}

export async function delTpl(params = {}) {
  return request.post(`/express/temp/delTemp`, {
    body: params,
  });
}

export async function saveTpl(params = {}) {
  return request.post('/express/temp/create', {
    body: params,
  });
}

// 新增某行规则
export async function saveRule(params = {}) {
  return request.post('/express/temp/addRule', {
    body: params,
  });
}
// 修改某行规则
export async function updateRule(params = {}) {
  return request.post('/express/temp/updateRule', {
    body: params,
  });
}
// 修改某行规则
export async function delRule(params = {}) {
  return request.post('/express/temp/delRule', {
    body: params,
  });
}

export async function createTpl(params = {}) {
  return request.post('/express/temp/create', {
    body: params,
    needData: 2,
  });
}
