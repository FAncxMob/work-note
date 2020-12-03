import request from '@/utils/request';

// 获取
export async function getGrouponSaleData(params = {}) {
  return request.get(`/search/groupon/saleinfo`, {
    query: params,
  });
}

export function getProductSaleData(params = {}) {
  params = {
    pageSize: 10,
    ...params,
  };
  return request.get(`/search/search/cgbSpuSaleData`, {
    query: params,
  });
}

export function getReceiptData(params = {}) {
  return request.get(`/order/order/logistics/listAll2`, {
    query: params,
  });
}

export function getReceiptDetailData(params = {}) {
  return request.get(`/order/order/logistics/orderLogisticsDetailList2`, {
    query: params,
  });
}

export function onDownload(params = {}) {
  return request.post(`export/create2`, {
    body: params,
    needData: 2,
  });
}
