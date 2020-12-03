import md5 from 'blueimp-md5';
import request from '@/utils/request';

const base = '/user';

export function loginByCode(params) {
  return request.get(`${base}/loginByScan`, { query: params });
}

export function loginByMobile(params) {
  return request.get(`${base}/loginByMobile4Biz`, { query: params });
}

export function getCaptcha(data) {
  return request.post('/smsserver/sms/send_code', {
    body: data,
  });
}

export function scanBind(params) {
  params.pwd = md5(params.pwd);
  delete params.rePwd;
  return request.post(`${base}/login/scanBind`, {
    body: params,
  });
}

export function resetPwd(params) {
  params.pwd = md5(params.pwd);
  return request.post(`${base}/user/forgetPwd`, {
    body: params,
  });
}

export function checkApply() {
  return request.get(`/supplier/supplier/check_for_apply`);
}

export function queryCategory(query) {
  return request.get(`/supplier/supplier_category/find_by_pid`, { query });
}

export function supplierApply(params) {
  return request.post(`/supplier/supplier/apply`, { body: params });
}
