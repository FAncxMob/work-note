const BASE_URL = 'https://merchantapi-sit.tradedge.cn';

const config = {
  BaseApiUrl: BASE_URL,
  appName: 'webapp-merchant',
  SignKey: 'hopin@2020',
  SignType: 'MD5',
  uploadUrl: `${BASE_URL}/file/file/upload`,
  UFFUrl: 'http://outerapi-sit.tradedge.cn/file/file/domain', // oss文件域名获取
  cdnUrl: 'https://cdn-hopin-sit.tradedge.cn', // 本地开发专用
  appId: 'wx16257c48b3784bb0',
  customerAppId: 'wx93ebda0d588aae2b', // C端小程序appId
  merchantAppId: 'wx4f96c6404a490837', // B端小程序appId
  redirectHost: 'hpjx.tradedge.cn', // 微信扫码登陆回调地址
  outerApiUrl: 'https://outerapi-sit.tradedge.cn',
  // B端小程序Banner可跳转页面
  merchantAppUrl: [
    {
      pageName: '测试页面',
      url: 'pages/test/index',
    },
    {
      pageName: '首页',
      url: 'pages/index/index',
    },
  ],
  defaultImg: 'https://image.tradedge.cn/defaultGoods.png',
};

module.exports = config;
