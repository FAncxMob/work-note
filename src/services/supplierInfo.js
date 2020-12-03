import request from '@/utils/request';

export async function getInfo(params = {}) {
  return request.get(`/supplier/supplier/manage_detail`, { query: params });
}
