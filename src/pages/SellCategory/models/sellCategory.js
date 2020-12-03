import {
  getSellCategoryData,
  addSellCategory,
  updateSellCategory,
  deleteSellCategory,
} from '@/services/sellCategory';

const DEFAULT_PAGESIZE = 36; // 默认每页的数据量

const Model = {
  namespace: 'sellCategory',
  state: {
    list: [],
  },
  effects: {
    *getList({ payload }, { call, put }) {
      try {
        yield put({ type: 'setLoading' });
        const response = yield call(getSellCategoryData, payload);
        yield put({
          type: 'saveList',
          payload: response,
        });
      } catch (error) {
        console.error(error);
      }
    },

    *add({ payload, callback }, { call, put }) {
      try {
        yield call(addSellCategory, payload);
        if (callback) callback();
      } catch (error) {
        console.error(error);
      }
    },
    *update({ payload, callback }, { call, put }) {
      try {
        yield call(updateSellCategory, payload);
        if (callback) callback();
      } catch (error) {
        console.error(error);
      }
    },

    *delete({ payload, callback }, { call }) {
      try {
        yield call(deleteSellCategory, payload);
        if (callback) callback();
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },

    setLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },

    reset(state) {
      return {
        ...state,
        list: [],
        pagination: {
          current: 1,
          pageSize: DEFAULT_PAGESIZE,
          total: 0,
        },
      };
    },
  },
};

export default Model;
