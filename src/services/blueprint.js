import request from '@/utils/request';

const BASE_URL = 'http://designapi-sit.tradedge.cn/api/page/';

export function getList(params) {
  return request.get(`${BASE_URL}getList`);
}

export function savePage(params) {
  return request.post(`${BASE_URL}save`, { body: params });
}

export function getPage(params) {
  return request.get(`${BASE_URL}get/${params.id}`);
}
