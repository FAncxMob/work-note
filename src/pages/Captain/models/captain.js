import {
  getGroupHeaderList,
  getPickupType,
  verifyGroupHeader,
  suspendGroupHeader,
  closedGroupHeader,
  openGroupHeader,
  getGroupHeaderDetail,
  updateGroupHeaderDetail,
  getIncomeAndExpense,
  getWaitForSettle,
  getCommission,
} from '@/services/groupHeader';

const Model = {
  namespace: 'groupHeader',
  state: {
    groupHeaderList: {
      list: [],
      pagination: {},
    }, // 团长列表
    groupHeaderDetail: { captainInfo: {}, authInfo: {}, bankInfo: {} }, // 团长详情
    pickupTypeList: [], // 自提点类型列表
    commission: {}, // 佣金信息
    incomeAndExpense: { list: [], pagination: {} }, // 收支明细
    waitForSettle: { list: [], pagination: {} }, // 待结算
    verifyStatus: [
      {
        text: '待审核',
        value: '0',
        color: 'orange',
      },
      {
        text: '已上线',
        value: '1',
        color: 'green',
      },
      {
        text: '未通过',
        value: '2',
        color: 'red',
      },
      {
        text: '已禁用',
        value: '3',
        color: '',
      },
      {
        text: '歇业中',
        value: '4',
        color: 'geekblue',
      },
    ], // 审核状态
    hostStatus: [
      {
        text: '认证中',
        value: '0',
        color: 'orange',
      },
      {
        text: '通过',
        value: '1',
        color: 'green',
      },
      {
        text: '未通过',
        value: '2',
        color: 'red',
      },
    ], // 实名认证审核状态
  },
  effects: {
    *queryGroupHeaderList({ payload, callback }, { call, put }) {
      try {
        const response = yield call(getGroupHeaderList, payload);
        yield put({
          type: 'saveGroupHeaderList',
          payload: response,
        });
      } catch (error) {
        console.error(error);
      }
    },
    *queryPickupType({ payload, callback }, { call, put }) {
      try {
        const response = yield call(getPickupType, payload);
        yield put({
          type: 'savePickupType',
          payload: response,
        });
      } catch (error) {
        console.error(error);
      }
    },
    *getCommission({ payload, callback }, { call, put }) {
      try {
        const response = yield call(getCommission, payload);
        yield put({
          type: 'saveCommission',
          payload: response,
        });
      } catch (error) {
        console.error(error);
      }
    },
    *getIncomeAndExpense({ payload, callback }, { call, put }) {
      try {
        const response = yield call(getIncomeAndExpense, payload);
        yield put({
          type: 'saveIncomeAndExpense',
          payload: response,
        });
      } catch (error) {
        console.error(error);
      }
    },
    *getWaitForSettle({ payload, callback }, { call, put }) {
      try {
        const response = yield call(getWaitForSettle, payload);
        yield put({
          type: 'saveWaitForSettle',
          payload: response,
        });
      } catch (error) {
        console.error(error);
      }
    },
    *queryGroupHeaderDetail({ payload, callback }, { call, put }) {
      try {
        const response = yield call(getGroupHeaderDetail, payload);
        yield put({
          type: 'saveGroupHeaderDetail',
          payload: response,
        });
      } catch (error) {
        console.error(error);
      }
    },
    *updateGroupHeaderDetail({ payload, callback }, { call, put }) {
      try {
        yield call(updateGroupHeaderDetail, payload);
        callback();
      } catch (error) {
        console.error(error);
      }
    },
    *verifyGroupHeader({ payload, callback }, { call, put }) {
      try {
        const response = yield call(verifyGroupHeader, payload);
        callback(response);
      } catch (error) {
        console.error(error);
      }
    },
    *suspendGroupHeader({ payload, callback }, { call, put }) {
      try {
        const response = yield call(suspendGroupHeader, payload);
        callback(response);
      } catch (error) {
        console.error(error);
      }
    },
    *closedGroupHeader({ payload, callback }, { call, put }) {
      try {
        const response = yield call(closedGroupHeader, payload);
        callback(response);
      } catch (error) {
        console.error(error);
      }
    },
    *openGroupHeader({ payload, callback }, { call, put }) {
      try {
        const response = yield call(openGroupHeader, payload);
        callback(response);
      } catch (error) {
        console.error(error);
      }
    },
  },
  reducers: {
    saveGroupHeaderList(state, { payload }) {
      state.groupHeaderList = payload;
      return { ...state };
    },
    saveGroupHeaderDetail(state, { payload }) {
      state.groupHeaderDetail = payload;
      return { ...state };
    },
    saveCommission(state, { payload }) {
      state.commission = payload;
      return { ...state };
    },
    saveIncomeAndExpense(state, { payload }) {
      state.incomeAndExpense = payload;
      return { ...state };
    },
    saveWaitForSettle(state, { payload }) {
      state.waitForSettle = payload;
      return { ...state };
    },
    savePickupType(state, { payload }) {
      const arr = [];
      (payload.list || []).forEach((item) => {
        arr.push({ text: item.name, value: item.id });
      });
      state.pickupTypeList = arr;
      return { ...state };
    },
    clearIncomeAndExpense(state, { payload }) {
      state.incomeAndExpense = { list: [], pagination: {} };
      return { ...state };
    },
  },
};
export default Model;
