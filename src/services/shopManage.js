import request from '@/utils/request';

export async function queryShopList(params = {}) {
  params = {
    pageSize: 20,
    currentPage: 1,
    ...params,
  };
  return request.post('/shop_service/shop/audit_shoplist', {
    body: params,
  });
}

export async function getDetail(params = {}) {
  return request.get(`/shop_service/shop/operate/shop_info?id=${params.id}`);
}

export async function onChangeService(params = {}) {
  return request.post(`/shop_service/shop/updateDisableStatus`, {
    body: params,
  });
}

export async function actionCertification(params = {}) {
  return request.post('/shop_service/shop/updateAuthStatus', {
    body: params,
  });
}
