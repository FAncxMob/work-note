import {
  getGrouponSaleData,
  getProductSaleData,
  getReceiptData,
  getReceiptDetailData,
  onDownload,
} from '@/services/grouponData';
import { getBaseCategoryList } from '@/services/goodsWarehouse';
import grouponService from '@/services/groupon';

const { getGroupInfo } = grouponService;

const Model = {
  namespace: 'grouponData',
  state: {
    saleData: {},
    categoryList: [],
    productSaleData: {
      list: [],
      pagination: {},
    },
    receiptData: {
      list: [],
      pagination: {},
    },
    receiptDetailData: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    // 获取团购信息
    *getGroupInfo({ payload, callback }, { call }) {
      const response = yield call(getGroupInfo, payload);
      callback(response);
    },

    *getGrouponSaleData({ payload, callback }, { call }) {
      const response = yield call(getGrouponSaleData, payload);
      callback(response);
    },

    *getCategoryList({ payload }, { call, put }) {
      const response = yield call(getBaseCategoryList, payload);
      yield put({
        type: 'saveCategoryList',
        payload: response,
      });
    },

    *getProductSaleData({ payload }, { call, put }) {
      const response = yield call(getProductSaleData, payload);
      yield put({
        type: 'saveProductSaleData',
        payload: response,
      });
    },

    *getReceiptData({ payload }, { call, put }) {
      const response = yield call(getReceiptData, payload);
      yield put({
        type: 'saveReceiptData',
        payload: response,
      });
    },

    *getReceiptDetailData({ payload }, { call, put }) {
      const response = yield call(getReceiptDetailData, payload);
      yield put({
        type: 'saveReceiptDetailData',
        payload: response,
      });
    },

    *download({ payload, callback }, { call }) {
      yield call(onDownload, payload);
      callback();
    },
  },
  reducers: {
    saveProductSaleData(state, { payload }) {
      state.productSaleData = payload;
      return {
        ...state,
      };
    },
    saveCategoryList(state, { payload }) {
      state.categoryList = payload.map(({ name, id }) => ({ text: name, value: id }));
      return {
        ...state,
      };
    },
    saveReceiptData(state, { payload }) {
      state.receiptData = payload;
      return {
        ...state,
      };
    },
    saveReceiptDetailData(state, { payload }) {
      state.receiptDetailData = payload;
      return {
        ...state,
      };
    },
  },
};

export default Model;
