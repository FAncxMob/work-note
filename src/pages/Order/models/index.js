import { throttle } from '@/utils/utils';
import {
  getOrderList,
  getReasonList,
  getGroupList,
  getRefundOrderList,
  getOrderDetail,
  getRefundOrderDetail,
} from '../service';

function resetData() {
  return {
    orderData: {},
    refundOrderData: {},
    reasonList: [],
    groupList: [],
    orderDetail: null,
  };
}
const timer = throttle();

const getGroupData = (payload) =>
  new Promise((res, rej) => {
    timer(async () => {
      const res1 = await getGroupList(payload);
      res(res1);
    }, 500);
  });

const sortsModel = {
  namespace: 'orderModel',
  state: resetData(),
  effects: {
    // 获取一般订单
    *getOrderList({ payload }, { call, put }) {
      const res = yield call(getOrderList, payload);
      if (res.pagination) {
        const data = { ...res.pagination };
        data.currentPage = res.pagination.current;
        res.pagination = data;
      }
      yield put({
        type: 'setDva',
        payload: { orderData: res },
      });
    },
    // 获取售后订单
    *getRefundOrderList({ payload }, { call, put }) {
      const res = yield call(getRefundOrderList, payload);
      yield put({
        type: 'setDva',
        payload: { refundOrderData: res },
      });
    },
    // 获取订单详情
    *getOrderDetails({ payload }, { call, put }) {
      const orderDetail = yield call(payload.id ? getRefundOrderDetail : getOrderDetail, payload);
      yield put({
        type: 'setDva',
        payload: { orderDetail },
      });
    },
    // 获取退款理由
    *getReasonList(data, { call, put }) {
      const res = yield call(getReasonList);
      const reasonList = res.map((item) => {
        return {
          value: item,
          text: item,
        };
      });
      yield put({
        type: 'setDva',
        payload: { reasonList },
      });
    },
    // 搜索获取团购数据
    *getGroupList({ payload }, { call, put }) {
      const res = yield call(getGroupData, payload);
      const groupList = res.map((item) => {
        return {
          value: item.id,
          text: item.name,
        };
      });
      yield put({
        type: 'setDva',
        payload: { groupList },
      });
    },
  },
  reducers: {
    setDva(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default sortsModel;
