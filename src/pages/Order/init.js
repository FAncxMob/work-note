export const initForm = () => {
  return {
    currentPage: 1,
    pageSize: 20,
    orderId: '',
    groupId: '',
    keyword: '',
    orderStatus: '',
  };
};
// 快递订单查询数据 ,orderType对应下面的配送方式属性名
export const commonInitForm = (orderType = 'Express') => {
  const data = initForm();
  data.remark = false;
  data.deliveryType = orderType;
  return data;
};
// 自提订单查询数据
export const refundInitForm = () => {
  const data = initForm();
  data.statusType = 'pending'; // deal(已处理)
  return data;
};
// 配送方式
export const type = {
  Express: { value: '快递', color: 'blue' },
  Delivery: { value: '配送', color: 'orange' },
  Pickup: { value: '自提', color: 'green' },
};
// 售后单筛选状态
export const statusTypeMaps = [
  { value: 'pending', label: '待处理', color: '' },
  { value: 'deal', label: '已处理', color: '' },
];

export const hasRemarksMap = [
  { value: false, label: '全部', color: '' },
  { value: true, label: '备注', color: '' },
];
// 订单状态集合
export const orderStatus = {
  // 订单状态
  // Created: '待付款',
  // Paid: '已支付',
  // Delivery: '已发货',
  // Receive: '已收货',
  // Feedback: '已评价',
  // Cancel: '已取消',
  // Expired: '超时取消',

  // 订单进度
  WaitForPay: { value: '待付款', color: 'magenta' },
  WaitForShare: { value: '待分享', color: 'volcano' },
  WaitForDelivery: { value: '待发货', color: 'gold' },
  WaitForReceive: { value: '待收货', color: 'cyan' },
  WaitForFeedBack: { value: '待评价', color: 'processing' },
  Feedback: { value: '已评价', color: 'success' },
  Cancel: { value: '已取消', color: '' },
  Expired: { value: '超时取消', color: '' },

  // // 拼团状态
  // None: '无效',
  // Create: '拼团中,待邀请好友参团',
  // Success: '拼团成功',
  // Fail: '拼团失败'
};
