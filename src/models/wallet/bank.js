import svc from '@/services/wallet';

const BankModel = {
  namespace: 'bankModel',
  state: {
    bankList: [],
    defaultBank: {},
    addressList: [], // 搜索的开户行地址列表
  },
  effects: {
    *getList({ callback }, { call, put }) {
      try {
        const list = yield call(svc.getAccountList);
        yield put({
          type: 'saveList',
          payload: list,
        });
      } catch (err) {}
      if (callback) callback();
    },
    *getDefault({ callback }, { call, put }) {
      try {
        const response = yield call(svc.getDefaultBankCard);
        yield put({
          type: 'saveDefault',
          payload: response,
        });
        if (callback) callback(response);
      } catch (error) {
        if (callback) callback({});
      }
    },
    *delBank({ payload }, { call, put }) {
      const response = yield call(svc.delBankAccount, payload);
      yield put({
        type: 'saveDelBank',
        payload: { ...payload, ...response },
      });
    },
    *addBank({ payload, callback }, { call, put }) {
      try {
        const { bankId: id } = yield call(svc.saveBankAccount, payload);
        yield put({
          type: 'saveAddBank',
          payload: { ...payload, id },
        });
        if (callback) callback(id);
      } catch (error) {
        if (callback) callback();
      }
    },
    // 开户行列表
    *getAddressList({ payload, callback }, { call, put }) {
      try {
        const response = yield call(svc.searchChannels, payload);
        yield put({
          type: 'saveAddressList',
          payload: response,
        });
        if (callback) callback(response);
      } catch (error) {
        if (callback) callback([]);
      }
    },
    // 查询银行卡是否有效
    *validBankCard({ payload }, { call }) {
      try {
        let { cardNo } = payload;
        cardNo = cardNo.replace(/\s/gi, '');
        const response = yield call(svc.getBankNameByCardNo, { cardNo });
        return response;
      } catch (error) {
        return {};
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return { ...state, bankList: action.payload || [] };
    },
    saveDefault(state, action) {
      return { ...state, defaultBank: action.payload || {} };
    },
    saveDelBank(state, action) {
      const { id } = action.payload;
      const arr = state.bankList.filter((v) => v.id !== id);
      return { ...state, bankList: [...arr] };
    },
    saveAddBank(state, action) {
      const { id, cardNo, owner, name, isOwner, isPrivate } = action.payload;
      const arr = state.bankList.unshift({ id, cardNo, owner, name, isOwner, isPrivate });
      return { ...state, bankList: [...arr] };
    },
    saveAddressList(state, action) {
      return { ...state, addressList: action.payload };
    },
  },
};
export default BankModel;
