import { orderStatus } from './init';

export function getOrderStatus() {
  const orderStatusMap = Object.entries(orderStatus);
  return orderStatusMap.map((item) => ({ value: item[0], text: item[1] }));
}

// 售后&退款状态
export const refundStatus = (s, t) => {
  s = parseInt(s);
  t = parseInt(t);
  const arr = [
    '',
    { value: '待取消', color: 'magenta' },
    { value: '取消中', color: 'gold' },
    { value: '已拒绝', color: 'error' },
    { value: '已取消', color: '' },
    { value: '客户已撤销', color: 'purple' },
  ];
  const arr1 = [
    '',
    { value: '待退款', color: 'magenta' },
    { value: '退款中', color: 'gold' },
    { value: '已拒绝', color: 'error' },
    { value: '已退款', color: '' },
    { value: '客户已撤销', color: 'purple' },
  ];
  if (s === 1) {
    return arr[s];
  }
  if (t === 2) {
    return arr1[s];
  }
  return '--';
};

// 组合地址信息
export const setAddress = (data, type = 'Express') => {
  if (!data) {
    return '缺失地址数据';
  }
  let item;
  if (type === 'Express' || type === 'Delivery') {
    item = {
      province: data.province || '',
      city: data.city || '',
      area: data.area || '',
      address: data.address || '',
      lng: data.lng || '',
      lat: data.lat || '',
    };
    return item.province + item.city + item.area + item.address;
  }
  item = {
    pickupAddress: data.pickupAddress || '',
    pickupLng: data.pickupLng || '',
    pickupLat: data.pickupLat || '',
  };
  return item.pickupAddress;
};
// 字符串图片转数组
export const imgToArry = (imgStr) => {
  if (!imgStr || typeof imgStr !== 'string') return [];
  return imgStr.split(',');
};
