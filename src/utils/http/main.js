import { getType } from '@/utils/type';
import { InterceptorManager } from './InterceptorManager';
import request from './request';

function requestForChain({ method, router, ...options }) {
  return request[method.toLowerCase()](router, options);
}

function execRequest(method, router, config) {
  if (getType(router) === 'string') {
    config.router = router;
  } else {
    config = router;
  }
  config = { method, ...config };
  let promise = Promise.resolve(config);

  const chain = [requestForChain, undefined];

  // 添加前置拦截器
  this.interceptors.request.reversForEach((interceptor) => {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  // 添加后置拦截器
  this.interceptors.response.forEach((interceptor) => {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
}

class Http {
  constructor() {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }

  /**
   * 发起GET请求
   *
   * @param {object} options - 通讯配置
   * @param {string} options.router - 路由地址
   * @param {object} options.body - 请求数据
   * @param {Map} options.resource - 资源定位参数
   * @param {object} options.query - 查询参数
   */
  get(router, options = {}) {
    return Reflect.apply(execRequest, this, ['GET', router, options]);
  }

  /**
   * 发起POST请求
   *
   * @param {object} options - 通讯配置
   * @param {string} options.router - 路由地址
   * @param {object} options.body - 请求数据
   * @param {Map} options.resource - 资源定位参数
   * @param {object} options.query - 查询参数
   * @param {object} options.header - 自定义头部
   */
  post(router, options = {}) {
    return Reflect.apply(execRequest, this, ['POST', router, options]);
  }
}

export default new Http();
