import config from '@/utils/config';

/**
 * 获取小程序码
 *
 * @param {*} query
 */
function getWxAppCodeUrl(query) {
  let url = `${config.cdnUrl}/weixin/wxapp/getwxacode3?`; /* cspell: disable-line */

  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      const value = query[key];
      if (!value) continue;
      url += `${key}=${value}&`;
    }
  }

  return url.slice(0, -1);
}

export { getWxAppCodeUrl };
