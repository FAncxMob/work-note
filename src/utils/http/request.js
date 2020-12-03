import { WebTdApi } from '@tdsdk/webtdapi';

import config from '../config';
import { version } from '../../../package.json';

const request = Symbol('request');

class Request {
  constructor() {
    const { BaseApiUrl, MockApiUrl, appName, SignKey, SignType } = config;

    WebTdApi.setup({
      BaseApiUrl,
      MockApiUrl,
      appName,
      SignKey,
      SignType,
      appVer: version,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async [request](method, url, option) {
    const { query = {}, header = {}, body = {} } = option;
    let res;
    if (method === 'GET') {
      res = await WebTdApi.get(url, query, config.mock, header);
    }
    if (method === 'POST') {
      res = await WebTdApi.post(url, body, query, config.mock, header);
    }
    return res;
  }

  post(url, option = {}) {
    return this[request]('POST', url, option);
  }

  get(url, option = {}) {
    return this[request]('GET', url, option);
  }
}

export default new Request();
