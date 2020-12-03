import { getList, getCommonType, addSort, editSort } from '../service';

const searchData = {
  pageSize: 10,
  pageCurrent: 1,
  nextKey: '',
};

function resetData() {
  return {
    sortTypeList: [],
    sortCommonList: [],
  };
}
const sortsModel = {
  namespace: 'sortsType',
  state: resetData(),
  effects: {
    *getList({ payload, callback }, { call, put }) {
      const res = yield call(getList, {
        pageSize: 10,
        nextKey: '',
        shopId: '435691223678627840',
        saleMode: '8',
        shelvesStatus: 1,
      });
      console.log(res);
      if (res) {
        yield put({
          type: 'setDva',
          payload: {
            sortTypeList: res.items,
          },
        });
        callback(res);
      }
    },
    *getCommonList({ payload }, { call, put }) {
      const res = yield call(getCommonType, searchData);
      console.log(res);
      if (res) {
        yield put({
          type: 'setDva',
          payload: {
            sortCommonList: res.list,
          },
        });
      }
    },
    *submitSort({ payload, callback }, { call }) {
      const res = payload.id ? yield call(editSort, payload) : yield call(addSort, payload);
      console.log(res);
      if (res) {
        callback();
      }
    },
  },
  reducers: {
    setDva(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default sortsModel;
