import request from '@/utils/request';

// const router = 'http://apidoc.tradedge.cn/mock/209/supplier';
// 获取一般订单列表
export function getOrderList(data) {
  // data.shopId = '435691223678627840';
  // data.shopId = '457457764842409984';
  return request.get(`/order/groupbuying/order/list2`, {
    query: data,
    needAuth: 1,
    needData: 2,
  });
}
// 获取售后订单列表
export function getRefundOrderList(data) {
  // data.shopId = '435691223678627840';
  // data.shopId = '457457764842409984';
  return request.get(`/refund/list4PC`, {
    query: data,
    needAuth: 1,
    needData: 2,
  });
}
// 获取售后订单详情
export function getRefundOrderDetail(data) {
  return request.get(`/refund/orderDetail`, {
    query: data,
    needAuth: 1,
    queryRole: { require: ['id'] },
  });
}
// 获取订单详情
export function getOrderDetail(data) {
  return request.get(`/order/order/info`, {
    query: data,
    needAuth: 1,
    queryRole: { require: ['orderId'] },
  });
}

// 获取取消订单理由列表
export function getReasonList() {
  return request.get(`/refund/find_reason?type=2`);
}
// 搜索团购列表
export function getGroupList(data) {
  // data.shopId = '435691223678627840';
  // data.shopId = '457457764842409984';
  return request.get(`/cgb/groupbuying/findGroupName`, {
    query: data,
    needAuth: 1,
    needData: 2,
  });
}

/**
 * 获取待处理退款单数量
 * groupId nextKey limit
 * @param {Object} data
 *
 */
export async function pendingCount(query) {
  return request.get(`/refund/pending_count`, {
    query,
    needData: 2,
    needAuth: 1,
    queryRole: { require: ['groupId'] },
  });
}
/**
 * 确认发货
 * @param {Object} data
 *
 */
export async function delivery(body) {
  return request.post(`/order/order/delivery`, {
    body,
    needAuth: 1,
    role: { require: ['orderId'] },
  });
}
/**
 * 确认收货
 * @param {Object} data
 *
 */
export async function receive(body) {
  return request.post(`/order/order/receive`, {
    body,
    needAuth: 1,
    role: { require: ['orderId'] },
  });
}
/**
 * 获取快递公司名称
 * @param {String} data
 *
 */
export async function expressCoName(params) {
  return request.get(`/express/express/findCompanyName`, {
    query: { expressNum: params },
    needAuth: 1,
    queryRole: { require: ['expressNum'] },
  });
}

/**
 * 设置商家备注
 * @param {*} params
 */
export async function setBusRemarks(body) {
  return request.post(`/order/order/seller_remark`, {
    body,
    needAuth: 1,
    role: { require: ['orderId'] },
  });
}

/**
 * 导出订单表格
 * @param {*} params
 */
export async function exportExcel(body) {
  return request.post(`/export/create`, {
    body,
    needAuth: 1,
    role: { require: ['taskType', 'taskName', 'params'] },
  });
}

/**
 *  取消订单（待发货，已付款）
 * @param {Object} param
 */
export async function cancelPayOrder(param) {
  return request.post(`/refund/cancelapply`, {
    needAuth: 1,
    body: param,
    role: { require: ['orderId', 'refundReason', 'operatorType'] },
  });
}
/**
 *  处理订单（同意&拒绝）
 * @param {String} param.id 退款单id
 * @param {String} param.dealType agree 同意  refuse拒绝
 * @param {String} param.reason 拒绝时填写的原因
 * @param {String} param.refundAmount 实际退款金额
 */
export async function dealAfter(param) {
  return request.post(`/refund/deal_after`, {
    body: param,
    role: { require: ['id', 'dealType'] },
    needAuth: 1,
  });
}
/**
 *  处理订单（同意&拒绝）
 * @param {String} param.id 退款单id
 * @param {String} param.dealType agree 同意  refuse拒绝
 * @param {String} param.reason 拒绝时填写的原因
 * @param {String} param.refundAmount 实际退款金额
 */
export async function dealCancel(param) {
  return request.post(`/refund/deal_cancel`, {
    body: param,
    role: { require: ['id', 'dealType'] },
    needAuth: 1,
  });
}
