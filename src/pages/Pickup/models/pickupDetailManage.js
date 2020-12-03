import { getPickupDetail, addPickup, editPickup } from '@/services/pickup';

const Model = {
  namespace: 'pickupDetailManage',
  state: {
    detailInfo: {},
  },
  effects: {
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getPickupDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
      if (callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call }) {
      try {
        const response = yield call(addPickup, payload);
        if (callback) {
          callback(response);
        }
      } catch (error) {
        console.log(error);
      }
    },
    *edit({ payload, callback }, { call }) {
      try {
        const response = yield call(editPickup, payload);
        if (callback) {
          callback(response);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    saveDetail(state, { payload }) {
      const {
        province: pname,
        city: cityname,
        area: adname,
        communityAddress: address,
        lat,
        lng,
        ...ret
      } = payload;

      const location = { lat, lng };

      return {
        ...state,
        detailInfo: {
          addressInfo: {
            pname,
            cityname,
            adname,
            address,
            location,
          },
          ...ret,
        },
      };
    },
    clear(state) {
      return {
        ...state,
        detailInfo: {},
      };
    },
  },
};

export default Model;
