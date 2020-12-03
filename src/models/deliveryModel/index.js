import { getList, saveRule, delTpl, createTpl, updateRule, delRule } from '@/services/Delivery';

const DeliveryModel = {
  namespace: 'deliveryModel',
  state: {
    // templateList: [],
  },
  effects: {
    *getList({ payload, callback }, { call, put }) {
      try {
        const response = yield call(getList, payload);
        /*  yield put({
          type: 'saveList',
          payload: response.filter((v) => v.delete !== 1),
        }); */
        if (callback) callback(response);
      } catch (error) {
        if (callback) callback();
      }
    },
    // 新增模板
    *createTemplate({ payload, callback }, { call, put }) {
      try {
        const response = yield call(createTpl, payload);
        /*  yield put({
          type: 'saveList',
        }); */
        if (callback) callback(response);
      } catch (error) {
        if (callback) callback();
      }
    },
    // 删除模板
    *del({ payload }, { call, put }) {
      try {
        yield call(delTpl, payload);
        /*  yield put({
          type: 'delList',
          payload,
        }); */
        return true;
      } catch (error) {
        return false;
      }
    },
    // 新增某行
    *saveRow({ payload, callback }, { call, put }) {
      try {
        const { id } = yield call(saveRule, payload);
        /* yield put({
          type: 'saveItem',
          payload: { ...payload, id },
        }); */
        if (callback) callback({ ...payload, id });
      } catch (error) {
        if (callback) callback();
      }
    },
    // 修改某行
    *updateRow({ payload, callback }, { call, put }) {
      try {
        yield call(updateRule, payload);
        /* yield put({
          type: 'saveItem',
          payload: { ...payload },
        }); */
        if (callback) callback(payload);
      } catch (error) {
        if (callback) callback();
      }
    },

    // 删除某行
    *delRow({ payload }, { call, put }) {
      try {
        yield call(delRule, payload);
        /* yield put({
          type: 'delItem',
          payload,
        }); */
        return true;
      } catch (error) {
        return false;
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        templateList: action.payload || [],
      };
    },
    saveItem(state, action) {
      console.log('ee');
      const newData = [...state.templateList];
      const index = newData.findIndex((item) => action.payload.id === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...action.payload });
      } else {
        newData.push(action.payload);
      }
      return {
        ...state,
        templateList: newData || [],
      };
    },
    delItem(state, action) {
      const { id, tempId } = action.payload;
      const list = state.templateList.map((v) => {
        if (v.id === tempId) {
          const index = v.ruleList.findIndex((t) => t.id === id);
          if (index > -1) v.ruleList.splice(index, 1);
        }
        return v;
      });
      return {
        ...state,
        templateList: [...list] || [],
      };
    },
    delList(state, action) {
      const { id } = action.payload;
      const list = state.templateList.filter((v) => v.id !== id);
      return {
        ...state,
        templateList: [...list] || [],
      };
    },
  },
};
export default DeliveryModel;
