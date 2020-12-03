import request from '@/utils/request';
/**
 * 创建云端参数
 *
 * @param {*} data
 */
async function setCloudParam(data) {
  const { id } = await request.post(`wxapp/param_code/add`, { needAuth: 0, data });
  return id;
}

/**
 * 获取云端参数
 *
 * @param {*} data
 */
async function getCloudParam(id) {
  const res = await request.get(`wxapp/param/findById`, { needAuth: 0, query: { id } });
  return res;
}

export { setCloudParam, getCloudParam };
