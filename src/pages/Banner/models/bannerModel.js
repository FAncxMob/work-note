import { getBannerList, addBanner, updateBanner, deleteBanner } from '@/services/banner';
import timeFormat from '@/utils/timefomart';

function makeKey() {
  return `key_${Math.random() * 1000 * Math.random()}`;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeTitle() {
  const randnum = rand(1000, 9999);
  const time = timeFormat(new Date().getTime(), 'Y-M-D').replace(/-/g, '');
  return time + randnum;
}

function makeDefaultBanner() {
  return {
    image: [],
    linkType: '',
    linkVal: '',
    key: makeKey(),
    title: makeTitle(),
  };
}

const Model = {
  namespace: 'bannerModel',
  state: {
    list: [],
  },
  effects: {
    *getList({ payload }, { call, put }) {
      try {
        const response = yield call(getBannerList, { ...payload, type: 3 });
        const list = response.list.map((i) => {
          const { url = '', linkType, name: title, toUrl: linkVal, ...ret } = i;
          return {
            ...ret,
            image: [url].filter((j) => j),
            linkOption: {
              linkType,
              linkVal,
            },
            title,
          };
        });
        yield put({
          type: 'saveList',
          payload: list,
        });
      } catch (error) {
        console.error(error);
      }
    },
    *editBanner({ payload }, { call, put }) {
      const request = payload.id ? updateBanner : addBanner;
      try {
        yield call(request, payload);
        yield put({
          type: 'getList',
        });
      } catch (error) {
        console.error(error);
      }
    },
    *delete({ payload }, { call, put }) {
      if (payload.id) {
        yield call(deleteBanner, { id: payload.id });
      }
      yield put({
        type: 'deleteListItem',
        payload,
      });
    },
  },
  reducers: {
    saveList(state, { payload }) {
      payload.forEach((i, index) => {
        i.index = index;
      });
      return {
        ...state,
        list: payload,
      };
    },
    addBannerForm(state) {
      const { list } = state;
      list.unshift({ ...makeDefaultBanner(), index: list.length });
      list.forEach((i, index) => {
        i.index = index;
      });
      return {
        ...state,
        list,
      };
    },
    deleteListItem(state, { payload }) {
      const { index } = payload;

      const { list } = state;
      list.splice(index, 1);
      list.forEach((i, dex) => {
        i.index = dex;
      });
      return {
        ...state,
        list: [...list],
      };
    },
  },
};

export default Model;
