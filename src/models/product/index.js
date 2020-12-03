// import { stringify } from 'querystring';
// import { history } from 'umi';
import {
  geList,
  getDetail,
  deleteItem,
  applyUp,
  getDown,
  addProduct,
  updateProduct,
  getCategoryList,
  getCityData,
} from './service';
import { getCategoryModelData, getCityModelData } from './utils';
// import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
function resetData() {
  return {
    list: {},
    detailData: null,
    cityTree: [], // 城市数据
    categoryTree: [], // 商品分类
    categorySearchData: {
      id: '',
      name: '',
      level: 1,
      parentId: '',
      platformCommissionRate: '',
    },
  };
}
const ProductModel = {
  namespace: 'productModel',
  state: resetData(),
  effects: {
    *getList({ payload }, { call, put }) {
      const res = yield call(geList, payload);
      if (res) {
        yield put({
          type: 'setDva',
          payload: { list: res },
        });
      }
    },
    *getDetail({ payload, callback }, { call }) {
      const res = yield call(getDetail, payload);
      if (res) {
        callback(res);
      }
    },
    *deleteItem({ payload, callback }, { call }) {
      const res = yield call(deleteItem, payload);
      callback(res);
    },
    *applyUp({ payload, callback }, { call }) {
      const res = yield call(applyUp, payload);
      callback(res);
    },
    *getDown({ payload, callback }, { call }) {
      const res = yield call(getDown, payload);
      callback(res);
    },
    // 获取商品分类
    *categoryOnLoadData({ payload }, { call, put }) {
      const res = yield call(getCategoryList, payload);
      if (res) {
        // const data = {
        //   title: res.name,
        //   key: res.id,
        //   value: res.id,
        //   disabled: true,
        // };
        const arr = getCategoryModelData(res.childCategories || []);
        // data.children = arr;
        yield put({
          type: 'setDva',
          payload: { categoryTree: arr },
        });
      }
    },
    // 获取服务城市
    *cityOnLoadData({ payload }, { call, put, select }) {
      const res = yield call(getCityData, payload);
      if (res) {
        const { cityTree } = yield select((state) => state.productModel);
        const { province } = payload;
        const newData = getCityModelData(cityTree, res.list, province);
        yield put({
          type: 'setDva',
          payload: { cityTree: newData },
        });
      }
    },
    // 新增商品分类
    *addProduct({ payload, callback }, { call }) {
      const res = yield call(addProduct, payload);
      callback(res);
    },
    // 更新商品
    *updateProduct({ payload, callback }, { call }) {
      const res = yield call(updateProduct, payload);
      callback(res);
    },
  },
  reducers: {
    setDva(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default ProductModel;
