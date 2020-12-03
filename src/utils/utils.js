import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import moment from 'moment';
import { getType } from './type';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const absolutePrefixReg = /^https?:\/\//;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export function today() {
  return [
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    moment().set({ hour: 23, minute: 59, second: 59, millisecond: 999 }),
  ];
}

export function beforeDay(includeToday) {
  return [moment().add(includeToday ? 0 : 1, 'days'), moment().add(includeToday ? 1 : 2, 'days')];
}

export function before7days(includeToday) {
  return [moment().add(includeToday ? 0 : 1, 'days'), moment().add(includeToday ? 6 : 7, 'days')];
}

export function last7days() {
  return [
    moment().subtract(6, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    moment().set({ hour: 23, minute: 59, second: 59, millisecond: 999 }),
  ];
}

export function last30days() {
  const ret = [
    moment().subtract(29, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    moment().set({ hour: 23, minute: 59, second: 59, millisecond: 999 }),
  ];
  return ret;
}

export function getSomeDate(dates, limit = 31, callback) {
  const startTime = dates[0].valueOf();
  let endTime = dates[1].valueOf();

  const limitDate = moment(startTime).add(limit, 'days').valueOf() - 1;

  if (endTime > limitDate) {
    endTime = limitDate;
  }
  const val = { date: [moment(startTime), moment(endTime)] };
  if (callback) {
    setTimeout(() => {
      callback(val);
    }, 0);
  }
  return val;
}

export function qs(url, query) {
  url += '?';
  Object.entries(query).forEach(([key, value]) => {
    url += `${key}=${value}&`;
  });
  return url.slice(0, -1);
}

// url: 图片/视频地址
export function filterSource(url) {
  if (!url) return '';
  if (absolutePrefixReg.test(url)) return url;
  const viewConfig = window.User.getViewConfig();
  if (!viewConfig) return '';
  const { prefixReg, prefixes } = viewConfig;
  let urlPre = '';
  // eslint-disable-next-line guard-for-in
  for (const key in prefixes) {
    const matchItem = key.match(prefixReg) && key.match(prefixReg)[0];
    if (matchItem) urlPre = `${prefixes[matchItem]}/`;
    break;
  }
  return url.replace(new RegExp(prefixReg), urlPre);
}

export function sleep(s) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, s);
  });
}

// 减法
export function sub(a = 0, b = 0) {
  // initialDecimal额外需要再添加的小数位数;

  const dec1 = (a.toString().split('.')[1] || []).length;
  const dec2 = (b.toString().split('.')[1] || []).length;
  const f = Math.pow(10, Math.max(dec1, dec2));
  const s = mul(a, f) - mul(b, f);
  return (s / f).toFixed(2);
}
// 乘法
export function mul(a = 0, b = 0, initialDecimal = 0) {
  let decimalLen = parseInt(initialDecimal, 0);

  const d = a.toString();

  const e = b.toString();

  const dec1 = (d.split('.')[1] || []).length;
  const dec2 = (e.split('.')[1] || []).length;
  decimalLen += dec1 + dec2;
  const s = Number(d.replace('.', '')) * Number(e.replace('.', ''));
  return (s / Math.pow(10, decimalLen)).toFixed(2);
}

/**
 * 判断对象是否为空
 * @param {Object} obj - 需要判断的对象
 * @param {Boolean} [isDeep=false] - 是否需要深度查看
 */
export function isEmptyObject(obj, isDeep = false) {
  if (isDeep) {
    return !(Object.keys(obj).length > 0);
  }
  for (const key in obj) {
    return false;
  }
  return true;
}

/**
 * 判断对象的数据类型
 *
 * @param {*} o
 * @param {string} type
 */
export function isType(o, type) {
  return getType(o).toLowerCase() === type.toLowerCase();
}

/**
 * 缺少关键参数
 * @param {string} name - 参数名称
 */
export function throwIfMissing(name) {
  throw new Error(`Missing parameter: ${name}`);
}

// 首字母大写
export function firstUpperCase(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}
/**
 *  节流
 * @returns function(function,number)
 */
export function throttle() {
  let timer = null;
  return function (fn, time = 1000) {
    if (!isType(fn, 'function')) console.error('参数类型错误');
    if (timer) clearTimeout(timer);
    timer = null;
    timer = setTimeout(fn, time);
  };
}
