import request from '@/utils/request';

const save = Symbol('save');
const load = Symbol('load');

export default class User {
  constructor() {
    this[load]();
  }

  async getInitConfig() {
    const data = await request.get('/config/get');
    this[save](data);
  }

  async setInfoApplyStatus() {
    const data = await request.get('/supplier/supplier/check_for_apply');
    this[save]({ infoApplyStatus: data.status });
  }

  getInfoApplyStatus() {
    return this.data.infoApplyStatus;
  }

  getRoles() {
    return this.data.userInfo && this.data.userInfo.roles.map((item) => item.id);
  }

  setUserInfo(userInfo) {
    this[save]({ userInfo });
  }

  setViewConfig(viewConfig) {
    this[save]({ viewConfig });
  }

  getToken() {
    return this.data.userInfo && this.data.userInfo.token;
  }

  getUserInfo() {
    return this.data.userInfo;
  }

  getDingTalk() {
    return this.data.dingTalk;
  }

  getViewConfig() {
    return this.data.viewConfig;
  }

  getDeviceId() {
    let deviceId = window.localStorage.getItem('deviceId');
    if (deviceId) return deviceId;
    deviceId = `${new Date().getTime()}${Math.floor(Math.random() * 1000000)}`;
    window.localStorage.setItem('deviceId', deviceId);
    return deviceId;
  }

  setAutoLogin(autoLogin) {
    const oldAutoLogin = JSON.parse(window.localStorage.getItem('autoLogin')) || {};
    const newAutoLogin = {
      flag: !!autoLogin,
      time: new Date().valueOf(),
    };
    if (oldAutoLogin.time !== undefined && oldAutoLogin.flag !== newAutoLogin.flag) {
      this.autoLogin = Object.assign(oldAutoLogin, newAutoLogin);
    } else {
      this.autoLogin = newAutoLogin;
    }
    window.localStorage.setItem('autoLogin', JSON.stringify(this.autoLogin));
  }

  getAutoLogin() {
    return this.autoLogin;
  }

  [save](data) {
    const oldData = JSON.parse(window.sessionStorage.getItem('__user')) || {};
    this.data = Object.assign(oldData, data);
    // todo: 增加签名
    // todo: 检查数据完整性
    window.sessionStorage.setItem('__user', JSON.stringify(this.data));
  }

  [load]() {
    const data = JSON.parse(window.sessionStorage.getItem('__user')) || {};
    const autoLogin = JSON.parse(window.localStorage.getItem('autoLogin')) || {};
    this.data = data;
    this.autoLogin = autoLogin;
  }
}
