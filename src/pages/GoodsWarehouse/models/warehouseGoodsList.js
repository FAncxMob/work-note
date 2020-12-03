import {
  getGoodsList,
  delGoods,
  startSale,
  stopSale,
  getBaseCategoryList,
} from '@/services/goodsWarehouse';

import WarehouseCategory from '@/customizeModel/WarehouseCategory';

const Model = {
  namespace: 'warehouseGoodsList',
  state: {
    listData: {
      list: [],
      pagination: {},
    },
    typeList: [],
  },
  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getGoodsList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getTypeList({ payload }, { call, put }) {
      const response = yield call(getBaseCategoryList, payload);
      yield put({
        type: 'saveTypeList',
        payload: response,
      });
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(delGoods, payload);
      if (callback) {
        callback(response);
      }
    },
    *changeStatus({ payload }, { call, put }) {
      const { productId, enable } = payload;
      const request = enable ? startSale : stopSale;
      yield call(request, { productId });
      yield put({
        type: 'changeItemStatus',
        payload,
      });
    },
  },
  reducers: {
    saveList(state, { payload }) {
      const { pagination, list } = payload;
      return {
        ...state,
        listData: { list, pagination },
      };
    },
    saveTypeList(state, { payload }) {
      const typeList = payload.map((item) => ({ value: item.id, text: item.name }));
      return {
        ...state,
        typeList,
      };
    },
    changeItemStatus(state, { payload: { enable, productId } }) {
      const {
        listData,
        listData: { list = [] },
      } = state;
      const index = list.findIndex((item) => item.id === productId);
      list[index].saleStatus = Number(enable);
      return {
        ...state,
        listData: {
          ...listData,
          list,
        },
      };
    },
  },
};

export default Model;
