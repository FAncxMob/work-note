const handlers = Symbol('handlers');

class InterceptorManager {
  constructor() {
    this[handlers] = [];
  }

  /**
   * 注册拦截器
   *
   * @param {Function} fulfilled
   * @param {Function} rejected
   */
  use(fulfilled, rejected) {
    this[handlers].push({
      fulfilled,
      rejected,
    });
    return this[handlers].length - 1;
  }

  /**
   * 销毁拦截器
   *
   * @param {Number} id
   */
  eject(id) {
    if (this[handlers][id]) {
      this[handlers][id] = null;
    }
  }

  /**
   * 遍历当前拦截器
   *
   * @param {Function} fn - 执行函数
   */
  forEach(fn) {
    this[handlers].forEach((h) => {
      fn(h);
    });
  }

  /**
   * 反向遍历当前拦截器
   *
   * @param {Function} fn - 执行函数
   */
  reversForEach(fn) {
    this[handlers].reverse().forEach((h) => {
      fn(h);
    });
  }
}

export { InterceptorManager };
