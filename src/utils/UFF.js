import request from '@/utils/request';

const defaultPrefix = Symbol('defaultPrefix');
const formatFile = Symbol('formatFile');

class UploadFileFilter {
  #prefixReg;

  #prefixes;

  async init(url) {
    try {
      const { prefixes, prefixReg } = await request.get(url);
      this.#prefixReg = new RegExp(prefixReg);
      this.#prefixes = prefixes;
    } catch (error) {
      console.error('远程获取图片服务配置失败');
    }
  }

  prefix(url) {
    url = url.toString();
    if (!url) return url;
    if (/^https?:\/\//.test(url)) return url;
    if (url.startsWith('wxfile://') || url.startsWith('data:image')) return url;
    if (!this.#prefixReg) return this[defaultPrefix](url);
    const result = this.#prefixReg.exec(url);
    if (!result) return '';
    const searchValue = result[0];
    let replaceValue = this.#prefixes[searchValue];
    replaceValue =
      replaceValue.charAt(replaceValue.length - 1) === '/' ? replaceValue : `${replaceValue}/`;
    return url.replace(result, replaceValue);
  }

  // http://apidoc.tradedge.cn/project/188/interface/api/4860 文档地址
  // 商品图
  getProductImage(filePath) {
    return this[formatFile](filePath, 'l_p');
  }

  // 多品商品详情图
  getSkuPDImage(filePath) {
    return this[formatFile](filePath, 'l_mp_d');
  }

  // 选规格商品图
  getSkuSelectImage(filePath) {
    return this[formatFile](filePath, 'l_sku');
  }

  // 购物车商品图
  getShoppingCarImage(filePath) {
    return this[formatFile](filePath, 'l_card');
  }

  // 单品拼团商品图
  getSingleGPImage(filePath) {
    return this[formatFile](filePath, 'g_spg');
  }

  // 单品拼团可参与拼单商品图
  getSingleCanGPImage(filePath) {
    return this[formatFile](filePath, 'g_can_spg');
  }

  // 多品购买商品图
  getSkuBuyImage(filePath) {
    return this[formatFile](filePath, 'g_buy_mp');
  }

  // 单品商品详情顶部主图
  getSingleBanner(filePath) {
    return this[formatFile](filePath, 'g_sp_banner');
  }

  // 单品商品详情底部商品详情图
  getSingleDetailImage(filePath) {
    return this[formatFile](filePath, 'g_sp_d');
  }

  // 搜索页面商品图
  getProductForSearch(filePath) {
    return this[formatFile](filePath, 's_p');
  }

  // 营业执照图
  getLicenseImage(filePath) {
    return this[formatFile](filePath, 'bl');
  }

  // 订单商品图
  getOrderSubmitImage(filePath) {
    return this[formatFile](filePath, 'o_p');
  }

  // 订单列表商品图
  getOrderListImage(filePath) {
    return this[formatFile](filePath, 'o_p_l');
  }

  // 订单详情商品图
  getOrderDetailImage(filePath) {
    return this[formatFile](filePath, 'o_p_d');
  }

  // 参与拼团商品图
  getShareImage(filePath) {
    return this[formatFile](filePath, 'p_pg');
  }

  // 参与拼团商品图
  getShareProductImage(filePath) {
    return this[formatFile](filePath, 'p_os');
  }

  // 团购内容图片
  getGroupContentImage(filePath) {
    return this[formatFile](filePath, 'gb_content');
  }

  // 团购商品列表图片
  getGroupListImage(filePath) {
    return this[formatFile](filePath, 'p_gb_p');
  }

  // 团购详情视频图片
  getGroupVideo(filePath, w = 375, h = 360) {
    const style = `snapshot,t_3000,f_jpg,w_${w},h_${h},m_fast`;
    return this[formatFile](filePath, style, 'video');
  }

  getVideoImg(filePath, w = 150, h = 150) {
    const style = `snapshot,t_3000,f_jpg,w_${w},h_${h},m_fast`;
    return this[formatFile](filePath, style, 'video');
  }

  // 获取video地址，用于播放
  getVideoUrl(filePath) {
    return this[formatFile](filePath, '', '');
  }

  // 获取商家背景图
  getShopBgImage(filePath) {
    return this[formatFile](filePath, 'b_hb');
  }

  // 获取团购商家Logo图
  getShopGroupLogo(filePath) {
    return this[formatFile](filePath, 'gb_s_logo');
  }

  // 获取平台商家logo
  getShopLogo(filePath) {
    return this[formatFile](filePath, 'p_s_logo');
  }

  // 获取海报商品图 702*702
  getPosterP(filePath) {
    return this[formatFile](filePath, 'poster_p');
  }

  // 获取海报头像 92*92
  getPosterHi(filePath) {
    return this[formatFile](filePath, 'poster_hi');
  }

  // B端邀请更多帮卖团长-头像 120*120
  getBusWgHi(filePath) {
    return this[formatFile](filePath, 'bus_wg_hi');
  }

  // C端申请成为平台帮卖-头像 98*98
  getCAghHi(filePath) {
    return this[formatFile](filePath, 'c_agh_hi');
  }

  // C端申请成为平台帮卖-上传图片 218*218
  getCAghUi(filePath) {
    return this[formatFile](filePath, 'c_agh_ui');
  }

  // H端帮卖首页-头像 98*98
  getHIHi(filePath) {
    return this[formatFile](filePath, 'h_i_hi');
  }

  // 团购帮卖分享页卡
  getCHsp(filePath) {
    return this[formatFile](filePath, 'c_hsp');
  }

  getThumb(filePath) {
    return this[formatFile](filePath, 'web_thumb');
  }

  [formatFile](filePath = '', OSSStyle, type = 'style') {
    if (/^http/.test(filePath)) return filePath;
    if (!filePath) return filePath;
    if (type === 'style') type = '?x-oss-process=style/';
    if (type === 'video') type = '?x-oss-process=video/';
    return this.prefix(filePath) + type + OSSStyle;
  }

  [defaultPrefix](url) {
    url = url.replace('td-image://', 'https://image.tradedge.cn/');
    url = url.replace('td-videos://', 'https://video.tradedge.cn/');
    return url;
  }
}

export default new UploadFileFilter();
