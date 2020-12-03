import request from '@/utils/request';

// 获取下载文件列表
export async function getDownloadList(params = {}) {
  params = {
    pageSize: 10,
    currentPage: 1,
    ...params,
  };
  return request.post(`/export/public/list2`, {
    body: params,
    needData: 2,
  });
}

// 获取下载文件列表
export async function onRetry(params = {}) {
  return request.post(`/export/retry`, {
    body: params,
  });
}
