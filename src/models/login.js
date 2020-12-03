import { stringify } from 'querystring';
import { history } from 'umi';
import {
  loginByMobile,
  loginByCode,
  getCaptcha,
  scanBind,
  resetPwd,
  queryCategory,
  checkApply,
  supplierApply,
} from '@/services/login';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {},
  effects: {
    *loginByCode({ payload, callback }, { call }) {
      const response = yield call(loginByCode, payload);
      callback(response);
    },

    *loginByMobile({ payload, callback }, { call }) {
      const response = yield call(loginByMobile, payload);
      callback(response);
    },

    *getCaptcha({ payload, callback }, { call }) {
      yield call(getCaptcha, payload);
      callback();
    },

    *scanBind({ payload, callback }, { call }) {
      const response = yield call(scanBind, payload);
      callback(response);
    },

    *resetPwd({ payload, callback }, { call }) {
      yield call(resetPwd, payload);
      callback();
    },

    *checkApply(_, { call }) {
      return yield call(checkApply);
    },

    *supplierApply({ payload, callback }, { call }) {
      yield call(supplierApply, payload);
      callback();
    },

    *queryCategory({ payload }, { call }) {
      return yield call(queryCategory, payload);
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        window.sessionStorage.removeItem('__user');
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {},
};
export default Model;
