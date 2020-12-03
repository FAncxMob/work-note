function priceValidator(title, maxPrice) {
  maxPrice = maxPrice || 99999.99;
  return {
    validator: (rule, value) => {
      if (value) {
        if (!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(value))
          return Promise.reject(`请输入有效的${title}，最多保留两位小数`);
        if (parseFloat(value) > maxPrice) return Promise.reject(`${title}最大只能输入${maxPrice}`);
      }
      return Promise.resolve();
    },
  };
}

function integerValidator(title, maxLength) {
  maxLength = maxLength || 99999;
  return {
    validator: (rule, value) => {
      if (value && !/^[0-9]\d{0,4}$/.test(value)) {
        return Promise.reject(`请输入有效的${title}，最大不能超过${maxLength}`);
      }
      return Promise.resolve();
    },
  };
}

function fnValidator(fn) {
  return {
    validator: (rule, value) => {
      const msg = fn(value);
      if (msg) return Promise.reject(msg);
      return Promise.resolve();
    },
  };
}

function checkMinimum(minimum) {
  return {
    validator: (rule, value) => {
      if (value < minimum) return Promise.reject('本团限购数量不能小于已售数量');
      return Promise.resolve();
    },
  };
}

function checkUploadFilesStatus() {
  return {
    validator: (rule, value) => {
      const flag = value.some((i) => {
        if (typeof i === 'string') return false;
        return !!i.status;
      });

      if (flag) return Promise.reject('文件上传中，请等待');
      return Promise.resolve();
    },
  };
}

export default {
  priceValidator,
  integerValidator,
  fnValidator,
  checkMinimum,
  checkUploadFilesStatus,
};
