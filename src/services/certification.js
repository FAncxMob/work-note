import request from '@/utils/request';

export async function queryList(params = {}) {
  params = Object.assign(
    {
      pageSize: 20,
      currentPage: 1,
    },
    params,
  );
  // TODO: 修改请求参数
  return request.post('http://apidoc.tradedge.cn/mock/185/certification/list', {
    body: params,
  });
}

export async function getDetail(params = {}) {
  // TODO: 修改请求参数
  return request.post('http://apidoc.tradedge.cn/mock/185/certification/list', {
    body: params,
  });
}

export async function onRefuseCertification(params = {}) {
  // TODO: 修改请求参数
  return request.post('http://apidoc.tradedge.cn/mock/185/certification/list', {
    body: params,
  });
}
