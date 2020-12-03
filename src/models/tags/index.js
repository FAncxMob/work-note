import HistoryStorage from '@/utils/storage';
import { getList } from './service';

const TagsModel = {
  namespace: 'TagsModel',
  state: {
    listData: [],
    historyList: HistoryStorage.getItem('goodTags') || [],
  },
  effects: {
    *getTagList(_, { call, put }) {
      const res = yield call(getList);
      yield put({
        type: 'setDva',
        payload: res,
      });
    },
  },
  reducers: {
    setDva(state, payload) {
      return { ...state, ...payload };
    },
  },
};
export default TagsModel;
