import * as svc from '@/services/blueprint';

const BlueprintModel = {
  namespace: 'blueprint',
  state: {
    list: [],
    page: {},
  },
  effects: {
    *getList({ callback }, { call, put }) {
      try {
        const list = yield call(svc.getList);
        yield put({
          type: 'saveList',
          payload: list,
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (callback) callback();
      }
    },

    *savePage({ cb, param }, { call }) {
      try {
        yield call(svc.savePage, param);
      } catch (err) {
        console.error(err);
      } finally {
        if (cb) cb(param);
      }
    },

    *getPage({ param }, { call, put }) {
      try {
        const res = yield call(svc.getPage, param);
        yield put({
          type: 'updatePage',
          payload: res,
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return { ...state, list: action.payload };
    },

    updatePage(state, action) {
      return { ...state, page: action.payload };
    },
  },
};

export default BlueprintModel;
