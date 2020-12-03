import { getInfo } from '@/services/supplierInfo';

const SupplierInfo = {
  namespace: 'supplierInfo',
  state: {
    data: {},
  },
  effects: {
    *getSupplierInfo({ payload }, { call, put }) {
      const response = yield call(getInfo, payload);
      yield put({
        type: 'setDva',
        payload: { ...response },
      });
    },
  },
  reducers: {
    setDva(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default SupplierInfo;
