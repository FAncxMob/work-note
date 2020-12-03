import svc from '@/services/wallet';
import { transformFenToYuan } from './utils';

const WalletModel = {
  namespace: 'walletModel',
  state: {
    walletInfo: {
      totalAmount: 0, // 可提现余额
      totalAmountInYuan: 0,
      lockAmount: 0, // 冻结金额余额
      lockAmountInYuan: 0, // 冻结金额余额
    },
    fundListData: {
      // 资产明细
      list: [],
      pagination: {},
    },
    frozenListData: {
      list: [],
      pagination: {},
    },
    todaySta: {}, // 今日同济数据
  },
  effects: {
    *getWalletInfo({ payload, callback }, { call, put }) {
      try {
        const response = yield call(svc.getTotalAndLockFee, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      } catch (error) {
        if (callback) callback({});
      }
    },
    *getFundList({ payload, callback }, { call, put }) {
      try {
        const response = yield call(svc.queryAssetDetails, payload);
        yield put({
          type: 'saveFundList',
          payload: response,
        });
        if (callback) callback(response);
      } catch (error) {
        if (callback) callback([]);
      }
    },
    *getFrozenList({ payload, callback }, { call, put }) {
      try {
        const response = yield call(svc.queryFreezeDetail, payload);
        yield put({
          type: 'saveFrozenList',
          payload: response,
        });
        if (callback) callback(response);
      } catch (error) {
        if (callback) callback([]);
      }
    },
    *applyToBank({ payload, callback }, { call }) {
      try {
        const response = yield call(svc.applyWithdrawalToBank, payload);
        if (callback) callback(response);
      } catch (error) {
        if (callback) callback();
      }
    },
  },
  reducers: {
    save(state, action) {
      const { totalAmount, lockAmount } = action.payload;
      return {
        ...state,
        walletInfo:
          {
            ...action.payload,
            totalAmountInYuan: transformFenToYuan(totalAmount),
            lockAmountInYuan: transformFenToYuan(lockAmount),
          } || {},
      };
    },
    saveFundList(state, action) {
      const { list, pagination } = action.payload;
      list.forEach((v) => {
        v.amountInYuan = transformFenToYuan(v.amount);
      });
      return { ...state, fundListData: { list, pagination } || {} };
    },
    saveFrozenList(state, action) {
      const { list, pagination } = action.payload;
      list.forEach((v) => {
        v.amountInYuan = transformFenToYuan(v.amount);
      });
      return { ...state, frozenListData: { list, pagination } || {} };
    },
    saveTodaySta(state, action) {
      return { ...state, todaySta: action.payload || {} };
    },
  },
};
export default WalletModel;
