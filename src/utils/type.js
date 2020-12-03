const TYPE = {
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Function]': 'function',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object RegExp]': 'regExp',
  '[object Object]': 'object',
  '[object Error]': 'error',
  '[object Map]': 'map',
  '[object Set]': 'set',
};

/**
 * 获取对象数据类型
 *
 * @param {*} object - 目标对象
 */
export function getType(object) {
  return TYPE[Object.prototype.toString.call(object)];
}

/**
 * 判断对象数据类型
 *
 * @param {*} object - 目标对象
 * @param {String} type - 数据类型
 * @returns {Boolean}
 */
export function isType(object, type = throwIfMissing('type')) {
  return TYPE[Object.prototype.toString.call(object)] === type;
}

/**
 * 判断对象是否为空
 *
 * @param {Object} obj - 需要判断的对象
 * @param {Boolean} [isDeep=false] - 是否需要深度查看
 */
export function isEmptyObject(obj, isDeep = false) {
  if (isDeep) return !(Object.keys(obj).length > 0);

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in obj) {
    return false;
  }

  return true;
}

export function throwIfMissing(name) {
  throw new Error(`Missing parameter: ${name}`);
}
