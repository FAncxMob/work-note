import {
  getBaseCategoryList,
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/services/goodsWarehouse';

const DEFAULT_PAGESIZE = 36; // 默认每页的数据量

const Model = {
  namespace: 'goodsWarehouseCategory',
  state: {
    list: [],
  },
  effects: {
    *getList({ payload }, { call, put }) {
      try {
        yield put({ type: 'setLoading' });
        const response = yield call(getBaseCategoryList, payload);
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
        yield call(addCategory, payload);
        if (callback) callback();
      } catch (error) {
        console.error(error);
      }
    },

    *update({ payload, callback }, { call, put }) {
      try {
        yield call(updateCategory, payload);
        if (callback) callback();
      } catch (error) {
        console.error(error);
      }
    },

    *delete({ payload, callback }, { call }) {
      try {
        yield call(deleteCategory, payload);
        if (callback) callback();
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        list: payload || [],
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
