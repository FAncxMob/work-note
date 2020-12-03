import { getPickupList, delPickup, changePickupStatus } from '@/services/pickup';

const Model = {
  namespace: 'pickupListModel',
  state: {
    listData: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getPickupList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(delPickup, payload);
      if (callback) {
        callback(response);
      }
    },
    *changeStatus({ payload }, { call, put }) {
      yield call(changePickupStatus, payload);
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
    changeItemStatus(state, { payload: { enable, id } }) {
      const { listData } = state;
      const index = listData.list.findIndex((item) => item.id === id);
      listData.list[index].isEnabled = enable;

      return {
        ...state,
        listData,
      };
    },
  },
};

export default Model;
