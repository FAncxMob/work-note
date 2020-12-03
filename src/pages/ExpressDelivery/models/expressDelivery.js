import expressDeliveryService from '@/services/expressDelivery';

const {
  getGrouponInfo,
  changeGrouponStatus,
  getBaseCategory,
  getProducts,
  getCategoryProducts,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  addCategory,
  delCategory,
  sortCategory,
  sortProducts,
} = expressDeliveryService;

const defaultState = {
  // 商品库列表
  products: {
    items: [],
    nextKey: '',
  },
  categoryList: [],
  categoryProducts: [],

  currentCategoryId: '', // 编辑区域当前选中的分类ID
  baseCategoryList: [],
};

const Model = {
  namespace: 'expressDelivery',
  state: defaultState,
  effects: {
    // 获取团购信息
    *getGrouponInfo({ payload, callback }, { call }) {
      const res = yield call(getGrouponInfo, payload);
      callback(res);
    },

    // 修改团购状态
    *changeGrouponStatus({ payload, callback }, { call }) {
      const res = yield call(changeGrouponStatus, payload);
      callback(res);
    },

    *setCurrentCategory({ payload }, { put }) {
      yield put({
        type: 'updateCurrentCategory',
        payload,
      });
    },

    // 获取商品库分类
    *getBaseCategory({ payload }, { call, put }) {
      const response = yield call(getBaseCategory, payload);
      yield put({
        type: 'saveBaseCategory',
        payload: response,
      });
    },

    // 获取商品库列表
    *getProducts({ payload }, { call, put }) {
      const response = yield call(getProducts, payload);
      yield put({
        type: 'saveProducts',
        payload: { ...response, isInit: !payload.nextKey },
      });
    },

    // 添加商品到团购
    *addProduct({ payload, callback }, { call, put }) {
      const response = yield call(onAddProduct, payload);
      yield put({
        type: 'addCategoryProducts',
        payload: response,
      });
      callback();
    },

    // 编辑团购商品
    *editProduct({ payload, callback }, { call, put }) {
      const response = yield call(onUpdateProduct, payload);
      yield put({
        type: 'updateCategoryProducts',
        payload: { data: payload, action: 'edit' },
      });
      callback(response);
    },

    // 删除团购商品
    *deleteProduct({ payload, callback }, { call, put }) {
      const response = yield call(onDeleteProduct, { productId: payload.productId });
      yield put({
        type: 'updateCategoryProducts',
        payload: { data: payload, action: 'delete' },
      });
      callback(response);
    },

    // 获取当前分类
    *getCategory({ payload, callback }, { call, put }) {
      const response = yield call(getCategoryProducts, payload);
      yield put({
        type: 'saveCategory',
        payload: response,
      });
      callback(response);
    },

    // 获取当前分类商品
    *getCategoryProducts({ payload, callback }, { call, put }) {
      const response = yield call(getCategoryProducts, payload);
      yield put({
        type: 'saveCategoryProducts',
        payload: response,
      });
      callback(response);
    },

    // 添加分类
    *addCategory({ payload }, { call, put }) {
      yield call(addCategory, payload);
      yield put({
        type: 'getCategory',
        payload: { groupBuyId: payload.grouponId },
      });
    },

    // 删除分类
    *delCategory({ payload }, { call, put }) {
      const { categoryProducts } = payload;
      delete payload.categoryProducts;
      yield put({
        type: 'delSpecifiedCategory',
        payload,
      });
      yield call(delCategory, payload);
      yield put({
        type: 'updateBaseProductStatus',
        payload: categoryProducts,
      });
    },

    // 排序分类
    *sortCategory({ payload }, { call, put }) {
      yield put({
        type: 'saveSortCategory',
        payload,
      });
      yield call(sortCategory, payload);
    },

    // 排序分类商品
    *sortProducts({ payload }, { call, put }) {
      yield put({
        type: 'saveSortProducts',
        payload,
      });
      yield call(sortProducts, payload);
    },
  },
  reducers: {
    clearData(state) {
      return { ...state, ...defaultState };
    },

    saveProducts(state, { payload }) {
      const { isInit } = payload;
      delete payload.isInit;
      payload.items = isInit ? payload.items : [...state.products.items, ...payload.items];
      state.products = payload;
      return { ...state };
    },

    saveCategory(state, { payload }) {
      const { categoryData, productInfoData } = payload;
      state.categoryList = categoryData;
      state.categoryProducts = productInfoData;
      return { ...state };
    },

    delSpecifiedCategory(state, { payload }) {
      const { categoryId } = payload;
      state.categoryList = state.categoryList.filter((x) => x.id !== categoryId);
      return { ...state };
    },

    saveCategoryProducts(state, { payload }) {
      const { productInfoData } = payload;
      state.categoryProducts = productInfoData;
      return { ...state };
    },

    saveSortCategory(state, { payload }) {
      const { categoryIds } = payload;
      const { categoryList } = state;
      state.categoryList = categoryIds.reduce((arr, current) => {
        arr.push(categoryList.find((x) => x.id === current));
        return arr;
      }, []);

      return { ...state };
    },

    saveSortProducts(state, { payload }) {
      const {
        categories: [{ productIds }],
      } = payload;
      const { categoryProducts } = state;
      state.categoryProducts = productIds.reduce((arr, current) => {
        arr.push(categoryProducts.find((x) => x.id === current));
        return arr;
      }, []);

      return { ...state };
    },

    updateCurrentCategory(state, { payload }) {
      state.currentCategoryId = payload.categoryId;
      return { ...state };
    },

    saveBaseCategory(state, { payload }) {
      state.baseCategoryList = payload;
      return { ...state };
    },

    addCategoryProducts(state, { payload }) {
      state.categoryProducts.push(payload);
      const { id, baseProductId } = payload;
      state.products.items.some((item) => {
        if (item.id === baseProductId) item.groupProductId = id;
        return item.id === payload.baseProductId;
      });
      return { ...state };
    },

    updateCategoryProducts(state, { payload: { data, action } }) {
      const { groupProductId, productId, id } = data;
      if (action === 'edit') {
        const index = state.categoryProducts.findIndex((item) => item.id === id);
        state.categoryProducts.splice(index, 1, data);
      } else {
        const currentId = groupProductId || productId;
        const index = state.categoryProducts.findIndex((item) => item.id === currentId);
        state.categoryProducts.splice(index, 1);
        const { baseProductId } = data;
        const i = state.products.items.findIndex((item) => item.id === baseProductId);
        state.products.items[i].groupProductId = undefined;
      }
      return { ...state };
    },

    updateBaseProductStatus(state, { payload }) {
      payload.forEach(({ baseProductId }) => {
        const i = state.products.items.findIndex((item) => item.id === baseProductId);
        state.products.items[i].groupProductId = undefined;
      });
      return { ...state };
    },
  },
};
export default Model;
