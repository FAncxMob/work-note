import { getDownloadList, onRetry } from '@/services/download';

const Model = {
  namespace: 'download',
  state: {
    downloadList: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    // 获取下载文件列表
    *getDownloadList({ payload }, { call, put }) {
      const response = yield call(getDownloadList, payload);
      yield put({
        type: 'saveDownloadList',
        payload: response,
      });
    },
    // 重试
    *retry({ payload, callback }, { call, put }) {
      yield call(onRetry, payload);
      yield put({
        type: 'updateDownloadList',
        payload,
      });
      callback();
    },
  },
  reducers: {
    saveDownloadList(state, { payload }) {
      state.downloadList = payload;
      return {
        ...state,
      };
    },
    updateDownloadList(state, { payload: { ossId } }) {
      state.downloadList.list.some((item) => {
        if (item.ossId === ossId) item.generateStatus = 3;
        return item.ossId === ossId;
      });
      return {
        ...state,
      };
    },
  },
};

export default Model;
