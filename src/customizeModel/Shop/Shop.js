import { throwIfMissing, isEmptyObject } from '@/utils/utils';
import svc from './service';

const updateData = Symbol('updateData');

class Shop {
  #init = null; // 获取中

  #id;

  #name;

  #description;

  #shopLogo;

  #weChatQrCode; // 微信二维码

  #contactMobile; // 手机

  #isLocalEnabled; // 本地

  #isGlobalEnabled; // 全国

  #tags;

  #isWorking; // 是否营业

  #isDisabled; // 是否禁用

  #authAuditStatus; // 店铺审核状态 0 未提交审核 | 1 审核中 | 2 审核失败 | 3 审核通过

  #authType; // 店铺类型 0 未选择 | 1 个人 | 2 个体工商 | 3 企业

  #reason; // 店铺审核拒绝原因

  #includeShopCategoryIdArray; // 获取店铺信息增加店铺经营类目字段,查询店铺标签时需要用

  #userId;

  #firstNames; // 一级经营类目名称

  #secondNames; // 二级经营类目名称

  #isGroup; // 团购

  #address; // 地图选的地址

  #detail; // 详细地址

  #province; // 省

  #city; // 市

  #area; // 地区

  #lng;

  #lat;

  #mainImages; // 店铺主图

  #backImages; // 店铺背景图

  #localConfigVO; // 本地基本信息

  #identity; // 身份  1 团长 | 2 店长

  async init() {
    if (this.#init !== null && this.#init.constructor === Promise) {
      return this.#init;
    }
    this.#init = new Promise(async (resolve, reject) => {
      const data =
        (await svc.findShopInfoByToken().catch(() => console.error('获取店铺信息失败'))) || {};
      await this[updateData](data);
      this.#init = null;
      resolve();
    });
    return this.#init;
  }

  /**
   * 获取店铺详情
   */
  async getShopInfo() {
    await this.init();

    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      shopLogo: this.#shopLogo,
      weChatQrCode: this.#weChatQrCode || '',
      contactMobile: this.#contactMobile,
      isLocalEnabled: this.#isLocalEnabled,
      isGlobalEnabled: this.#isGlobalEnabled,
      tags: this.#tags,
      isWorking: this.#isWorking,
      authType: this.#authType,
      isDisabled: this.#isDisabled,
      authAuditStatus: this.#authAuditStatus,
      reason: this.#reason,
      includeShopCategoryIdArray: this.#includeShopCategoryIdArray,
      userId: this.#userId,
      firstNames: this.#firstNames,
      secondNames: this.#secondNames,
      isGroup: this.#isGroup, // 团购
      address: this.#address, // 地图选的地址
      detail: this.#detail, // 详细地址
      province: this.#province, // 省
      city: this.#city, // 市
      area: this.#area, // 地区
      lng: this.#lng,
      lat: this.#lat,
      mainImages: this.#mainImages,
      backImages: this.#backImages,
      localConfigVO: this.#localConfigVO,
      identity: this.#identity,
    };
  }

  getShopCategory() {
    return this.#includeShopCategoryIdArray;
  }

  async getTags() {
    return this.#tags;
  }

  getMobile() {
    return this.#contactMobile;
  }

  /**
   * 获取店铺审核状态
   *
   * @returns {string} 0 未提交审核 | 1 审核中 | 2 审核失败 | 3 审核通过
   */
  async getAuth() {
    await this.getShopInfo();
    return this.#authAuditStatus;
  }

  /**
   * 获取营业状态
   *
   * @returns {boolean}
   */
  async isWorking() {
    await this.getShopInfo();
    return !!this.#isWorking;
  }

  async getShopId() {
    if (!this.#id) await this.getShopInfo();
    return this.#id;
  }

  /**
   * 创建店铺
   *
   * @param {Object} info 开店资料
   * @param {String} info.contactMobile 店铺联系电话
   * @param {String} info.shopLogo 店铺logo
   * @param {String} info.name 店铺名称
   * @param {Number} info.isLocalEnabled 是否启用本地店
   * @param {Number} info.isGlobalEnabled 是否启用全国店
   * @param {Number} info.isGroup 是否启用团购
   *
   */
  async create(info) {
    ['contactMobile', 'shopLogo', 'name', 'isLocalEnabled', 'isGlobalEnabled', 'isGroup'].forEach(
      (key) => {
        if (typeof info[key] === 'undefined') throwIfMissing(key);
      },
    );

    const { data } = (await svc.createShop(info).catch((err) => console.error(err))) || {};
    this[updateData](data);
  }

  async edit(info) {
    [
      'contactMobile',
      'shopLogo',
      'name',
      'isLocalEnabled',
      'isGlobalEnabled',
      'isGroup',
      'tags',
      'detail',
      'province',
      'city',
      'area',
      'lng',
      'lat',
    ].forEach((key) => {
      if (typeof info[key] === 'undefined') throwIfMissing(key);
    });

    await svc.editShop(info).catch((err) => console.error(err));
    this[updateData](info);
  }

  async credentials(info) {
    await svc.credentials(info).catch((err) => console.error(err));
    this[updateData](info);
  }

  async findRequest(info) {
    const res = await svc.findRequest(info).catch((err) => console.error(err));
    this[updateData](info);
    return res;
  }

  // 获取店铺首页今日相关统计数据
  // eslint-disable-next-line class-methods-use-this
  async getShopTodaySta(info) {
    const res = await svc.getShopTodaySta(info).catch((err) => console.error(err));
    return res;
  }

  async isCreateShop() {
    return !!(await this.getShopId());
  }

  async hasEditShopInfo() {
    return !!this.#tags;
  }

  async updateData(shopInfo) {
    this[updateData](shopInfo);
  }

  [updateData](shopInfo) {
    if (!shopInfo) return;
    if (isEmptyObject(shopInfo)) return;

    Object.entries(shopInfo).forEach(([key, value]) => {
      switch (key) {
        case 'id':
          this.#id = value;
          break;
        case 'name':
          this.#name = value;
          break;
        case 'description':
          this.#description = value;
          break;
        case 'shopLogo':
          this.#shopLogo = value;
          break;
        case 'weChatQrCode':
          this.#weChatQrCode = value;
          break;
        case 'contactMobile':
          this.#contactMobile = value;
          break;
        case 'isLocalEnabled':
          this.#isLocalEnabled = value;
          break;
        case 'isGlobalEnabled':
          this.#isGlobalEnabled = value;
          break;
        case 'tags':
          this.#tags = value;
          break;
        case 'isWorking':
          this.#isWorking = value;
          break;
        case 'isDisabled':
          this.#isDisabled = value;
          break;
        case 'authType':
          this.#authType = value;
          break;
        case 'authAuditStatus':
          this.#authAuditStatus = value;
          break;
        case 'reason':
          this.#reason = value;
          break;
        case 'userId':
          this.#userId = value;
          break;
        case 'includeShopCategoryIdArray':
          this.#includeShopCategoryIdArray = value;
          break;
        case 'firstNames':
          this.#firstNames = value;
          break;
        case 'secondNames':
          this.#secondNames = value;
          break;
        case 'isGroup':
          this.#isGroup = value;
          break;
        case 'address':
          this.#address = value;
          break;
        case 'detail':
          this.#detail = value;
          break;
        case 'province':
          this.#province = value;
          break;
        case 'city':
          this.#city = value;
          break;
        case 'area':
          this.#area = value;
          break;
        case 'lng':
          this.#lng = value;
          break;
        case 'lat':
          this.#lat = value;
          break;
        case 'mainImages':
          this.#mainImages = value;
          break;
        case 'backImages':
          this.#backImages = value;
          break;
        case 'localConfigVO':
          this.#localConfigVO = value;
          break;
        case 'identity':
          this.#identity = value;
          break;
        default:
          break;
      }
    });
  }
}

export default new Shop();
