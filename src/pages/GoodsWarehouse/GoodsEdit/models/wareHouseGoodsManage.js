import {
  addGoods,
  editGoods,
  getGoods,
  delGoods,
  getBaseCategoryList,
} from '@/services/goodsWarehouse';
import analysisGoodsInfo from '../tool/analysisGoodsInfo';

const defaultCB = () => {};

const GOODS_DEFAULT_INFO = {
  skuType: 'single',
  saleStatus: true,
  deliveryType: 'pickupAndExpress',
  moreSku: {},
  images: [],
  detailImages: [],
  video: [],
  videoImage: [],
};

const Model = {
  namespace: 'wareHouseGoodsManage',
  state: {
    listData: {
      list: [],
      pagination: {},
    },
    goodsInfo: {
      sendWay: '',
      status: true,
    },
    typeList: [],
  },
  effects: {
    *delete({ payload, callback = defaultCB }, { call }) {
      const response = yield call(delGoods, payload);
      callback(response);
    },
    *add({ payload, callback = defaultCB }, { call, put }) {
      try {
        const response = yield call(addGoods, payload);
        callback(response);
      } catch (error) {
        console.log(error);
      }
    },
    *edit({ payload, callback = defaultCB }, { call }) {
      const response = yield call(editGoods, payload);
      callback(response);
    },
    *getGoods({ payload, callback = defaultCB }, { call, put }) {
      try {
        const response = yield call(getGoods, payload);
        const typeList = yield call(getBaseCategoryList, payload);
        yield put({
          type: 'saveTypeList',
          payload: typeList,
        });
        yield put({
          type: 'saveGoodsInfo',
          payload: { ...response, typeList },
        });
        callback(response);
      } catch (error) {
        yield put({
          type: 'clearGoods',
        });
        console.log(error);
      }
    },
    *getTypeList({ payload }, { call, put }) {
      const response = yield call(getBaseCategoryList, payload);
      yield put({
        type: 'saveTypeList',
        payload: response,
      });
    },
  },
  reducers: {
    saveGoodsInfo(state, { payload = GOODS_DEFAULT_INFO }) {
      const goodsInfo = analysisGoodsInfo(payload);
      return {
        ...state,
        goodsInfo,
      };
    },

    clearGoods(state) {
      return {
        ...state,
        goodsInfo: { ...GOODS_DEFAULT_INFO },
      };
    },
    saveTypeList(state, { payload }) {
      const typeList = payload.map((item) => ({ value: item.id, text: item.name }));

      return {
        ...state,
        typeList,
      };
    },
    setGoodsInfo(state, { payload }) {
      const { goodsInfo } = state;
      return {
        ...state,
        goodsInfo: {
          ...goodsInfo,
          ...payload,
        },
      };
    },
    changeSkuType(state, { payload }) {
      const { goodsInfo } = state;
      goodsInfo.skuType = payload;
      return {
        ...state,
        goodsInfo,
      };
    },
  },
};

export default Model;
