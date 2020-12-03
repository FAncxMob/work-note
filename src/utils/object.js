import InputGroup from '@/components/InputGroup';
import { isType } from './type';
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

/**
 * 判断两个对象是否相同
 *
 * @param {*} x
 * @param {*} y
 */
export function objectEquals(x, y) {
  if (x === null || x === undefined || y === null || y === undefined) return x === y;
  if (x.constructor !== y.constructor) return false;
  if (x instanceof Function) return x === y;
  if (x instanceof RegExp) return x === y;
  if (x === y || x.valueOf() === y.valueOf()) return true;
  if (Array.isArray(x) && x.length !== y.length) return false;
  if (x instanceof Date) return false;
  if (!(x instanceof Object)) return false;
  if (!(y instanceof Object)) return false;

  const p = Object.keys(x);
  return (
    Object.keys(y).every((i) => p.indexOf(i) !== -1) && p.every((i) => objectEquals(x[i], y[i]))
  );
}

/**
 * 合并对象
 *
 * @param {*} obj1
 * @param {*} obj2
 * @description 如果有相同的属性且不是对象，后者覆盖前者，如果相同属性是对象，则对象继续合并
 */
export function objectMerge(obj1, obj2) {
  let result = {};
  if (isType(obj1, 'array')) {
    result = [];
  }

  Object.keys(obj1).forEach((key) => {
    if (typeof obj2 === 'object' && key in obj2 && typeof obj1[key] === 'object' && key !== null) {
      result[key] = objectMerge(obj1[key], obj2[key]);
    } else {
      result[key] = obj1[key];
    }
  });

  Object.keys(obj2).forEach((key) => {
    if (key in result && typeof result[key] === 'object' && key !== null) {
      result[key] = objectMerge(obj1[key], result[key]);
    } else {
      result[key] = obj2[key];
    }
  });

  return result;
}
