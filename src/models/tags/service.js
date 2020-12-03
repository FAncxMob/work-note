import request from '@/utils/request';
// 获取大家都在用的标签list列表
export function getList(data) {
  return request.post(`/product/list`, {
    body: data,
  });
}
