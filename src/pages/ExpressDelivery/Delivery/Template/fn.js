import React from 'react';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// 根据id搜索index
export const findIndexById = (list, id, newId) => {
  return list.findIndex((v) => v.id === id || (newId && v.id === newId));
};
// 是否删除
export const confirmDel = (type) => {
  return new Promise((resolve) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `确认删除该条${type === 'template' ? '模板' : '运费规则'}？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        resolve();
      },
    });
  });
};

// 验证表单
export const verifyData = (record) => {
  const { fee, tempId, tempCity } = record;
  if (tempCity) {
    // 临时选择的城市，点击保存才赋值
    record.city = tempCity.city;
    record.content = JSON.stringify(tempCity.cityList);
    record.code = tempCity.code;
  }

  const { code, city, content } = record;
  if (!record.code || !Number(fee)) {
    message.warning('请正确填写城市或运费！');
    return {
      isError: true,
      query: {},
    };
  }

  delete record.tempCity;
  return {
    isError: false,
    query: { fee, code, city, content, tempId },
  };
};
// 获取城市（all代表选中该省下所有市，故city:直接显示省，否则武汉市，咸宁市（湖北省）， xx，xx（）这样显示, code:400100, 45000,77777）
export const getCity = ({ cityList = [] }) => {
  let str = '';
  let code = '';
  for (const key in cityList) {
    // 省
    if (cityList.hasOwnProperty(key)) {
      const item = cityList[key];
      code = item.childCodeStr;
      if (item.all || item.list.length === 0) str += `${item.name}； `;
      else {
        for (const k in item.list) {
          if (Object.prototype.hasOwnProperty.call(item.list, k)) {
            const t = item.list[k];
            str += `${t.name}, `;
          }
        }
        str = `${str.slice(0, str.length - 2)}（${item.name}）； `; // 某某省(需要去掉前面的逗号)
      }
    }
  }
  return {
    city: str,
    code,
  };
};

// 验证 统一模板内各条规则之间城市是否重复
export const verifyCityRepeat = (selCityObj, record, list) => {
  const parentIndex = list.findIndex((v) => v.id === record.tempId);
  if (parentIndex <= -1) {
    return { isError: true, msg: '找不到该模板' };
  }

  // 过滤出当前选中子集城市code
  let selArr = [];
  for (const key in selCityObj) {
    if (selCityObj.hasOwnProperty(key)) {
      const { childCodeStr = '' } = selCityObj[key];
      if (childCodeStr) {
        selArr = selArr.concat(childCodeStr.split(','));
      }
    }
  }

  // 过滤出当前模板所有子集城市code（不包括当前正在选择的）
  let codeArr = [];
  list[parentIndex].ruleList.forEach((item) => {
    if (item.id !== record.id && !!item.code) codeArr = codeArr.concat(item.code.split(','));
  });
  const codeSet = new Set(codeArr);
  const isError = selArr.some((v) => codeSet.has(v));

  if (isError);
  return { isError, msg: '城市重复，请重新选择' };
};

// 验证模板名称重复
export const verifyNameRepeat = (name, list) => {
  const isError = list.some((v) => v.name.trim() === name.trim());
  return { isError, msg: '模板名称重复，请重新选择' };
};
