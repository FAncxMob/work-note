import { notification } from 'antd';
import Shop from '@/customizeModel/Shop/Shop';
import http from './http/main';
/**
 * 生成通讯头配置
 *
 * @param {number} needAuth - 通讯需要的权限
 *                          - 0 空
 *                          - 1 使用 token
 * @param {object} header -  外部传入的通讯头部配置
 * @returns
 */
function getHeader(needAuth, header = {}) {
  if (needAuth >= 1) {
    header.token = window.User.getToken();
  }

  for (const [k, v] of Object.entries(header)) {
    if (['content-type'].includes(k)) continue; // eslint-disable-line no-continue
    delete header[k];
    header[k.toUpperCase()] = v;
  }

  return header;
}

/**
 * 前置拦截器
 */
// 处理请求头的权限
http.interceptors.request.use(async (config) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  typeof config.needAuth === 'undefined' && (config.needAuth = 1);
  config.header = getHeader(config.needAuth, config.header);

  return config;
});

// 处理请求数据
http.interceptors.request.use(async (config) => {
  const { body = {}, query = {}, needData, method } = config;

  /**
   * 附件请求数据
   *
   * @param {number} needData - 通讯需要的权限
   *                          - 1 id 店铺Id
   *                          - 2 附件shopId
   * */
  if (needData === 1) {
    if (method === 'POST' && !body.id) body.id = await Shop.getShopId(); // || '429919432783618048'
    if (method === 'GET' && !query.id) query.id = await Shop.getShopId(); // || '429919432783618048'
  }

  if (needData === 2) {
    if (method === 'POST' && !body.shopId) body.shopId = await Shop.getShopId(); // || '429919432783618048'
    if (method === 'GET' && !query.shopId) query.shopId = await Shop.getShopId(); // || '429919432783618048'
  }
  return { ...config, body, query };
});

http.interceptors.request.use(async (config) => {
  let { body = {} } = config;
  if (body.file) {
    body = body.file;
  }
  config.body = body;
  return config;
});

// 处理请求参数验证
http.interceptors.request.use(async (config) => {
  const { role, queryRole, body, query } = config;

  if (role && role.require) {
    role.require.forEach((prop) => {
      const propArr = prop.split('.');
      let temp = JSON.parse(JSON.stringify(body));

      propArr.forEach((p) => {
        p = temp[p];
        if (typeof p === 'undefined') throw Error('必要参数缺失');
        temp = p;
      });
    });
  }
  if (queryRole && queryRole.require) {
    queryRole.require.forEach((prop) => {
      const propArr = prop.split('.');
      let temp = JSON.parse(JSON.stringify(query));

      propArr.forEach((p) => {
        if (typeof temp[p] === 'undefined') throw Error(`必要参数缺失：${p}`);
        temp = temp[p];
      });
    });
  }

  return config;
});

/**
 * 后置拦截器
 */
http.interceptors.response.use(async (res) => {
  return new Promise((resolve, reject) => {
    if (res.code !== 0 && res.code !== 'ok') {
      if (res.sub_code.indexOf('error') === 0) {
        notification.error({ message: `系统错误，请联系管理员` });
      } else {
        notification.error({ message: `操作失败`, description: res.sub_msg });
      }
      reject(new Error(res.sub_msg));
    } else {
      resolve(res.data);
    }
  });
});

export default http;
