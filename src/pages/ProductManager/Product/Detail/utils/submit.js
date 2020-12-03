import { history } from 'umi';
import { message } from 'antd';
import { throwError } from '@/utils/error';
import { skus } from './init';
import { isNumbers } from './utils';
// 多规格组合数据
function setSubmitData(details, _this) {
  try {
    // 清洁规格相关数据
    details.skuAttrs = [];
    details.skus = [];
    let { skusTableList, skusType } = _this.state;
    // 解决每次提交时，因数据形式变动导致的antdesign数据传入崩溃的问题
    skusTableList = JSON.parse(JSON.stringify(skusTableList));
    // 处理规格数据并合并
    for (const item of skusType) {
      // 规格标题没写直接返回
      if (!item.title) return '规格标题未填写';
      // 规格具体内容没写直接返回
      if (item.skus.some((sku) => sku === undefined || sku === '')) return '具体规格未填写';
      details.skuAttrs.push(item.title);
    }
    // supplyPrice: '', // 供货价
    // suggestPrice: '', // 建议零售价
    // marketPrice: '', // 市场价
    // 规格表格数据，并合并
    for (const item of skusTableList) {
      const { supplyPrice, suggestPrice, marketPrice, barcode, weight, volume, stock } = item;
      // for (const name in item) {
      //   if(name!=='name'||name!=='key'){

      //     const checkResult = _this.checkNumberInput(name, item[name], '供货价');
      //     if (!checkResult) return checkResult;
      //   }
      // }

      if (supplyPrice === undefined || supplyPrice === '') {
        return '供货价未填写';
      }
      if (!validator(supplyPrice, '供货价')) return undefined;

      if (suggestPrice === undefined || suggestPrice === '') return '建议零售价未填写';
      if (!validator(suggestPrice, '建议零售价')) return undefined;

      if (marketPrice === undefined || marketPrice === '') return '市场价未填写';
      if (!validator(suggestPrice, '市场价')) return undefined;

      if (supplyPrice > suggestPrice || supplyPrice > marketPrice) {
        return '供货价不能大于建议零售价和市场价';
      }
      if (barcode && barcode.length > 50) {
        message.warn('商品条码过长，不能超过50');
      }
      if (weight && !validator(weight, '重量')) return undefined;
      if (volume && !validator(volume, '体积')) return undefined;
      if (stock && !checkNumberInput('stock', stock, '库存')) return undefined;
      item.image = item.image && item.image[0] ? item.image[0].subUrl : '';
      item.volume = !volume ? 0 : Number(volume);
      item.stock = stock === '' || stock === undefined ? -1 : Number(stock);
      item.weight = !weight ? 0 : Number(weight);
      item.supplyPrice = Number(supplyPrice);
      item.suggestPrice = Number(suggestPrice);
      item.marketPrice = Number(marketPrice);
      details.skus.push(item);
    }
    delete details.stock;
    delete details.suggestPrice;
    delete details.supplyPrice;
    delete details.volume;
    delete details.weight;
    delete details.marketPrice;
    filterTheVideoImg(details);
    return true;
  } catch (error) {
    console.log(error);
    return error.message;
  }
}

// 处理上传图片和视频的提交数据
function filterTheVideoImg(details) {
  try {
    details.detailImages = details.detailImages.map((item) => item.subUrl) || [];
    details.images = details.images.map((item) => item.subUrl) || [];
    details.video = details.video.map((item) => item.subUrl).join(',');
  } catch (error) {
    console.log(error);
  }
}
// 判断要数字验证的字段
export function checkNumberInput(name, value, str) {
  try {
    // if (required) {
    //   if (value === undefined || value === '') {
    //     return `${str}未填写`;
    //   }
    // } else if (value === '') return true;
    if (value === '') return true;
    if (
      name === 'supplyPrice' ||
      name === 'suggestPrice' ||
      name === 'marketPrice' ||
      name === 'weight' ||
      name === 'volume'
    ) {
      return validator(value, str);
    }
    if (name === 'barcode') {
      if (value.length > 50) {
        throwError('商品条码长度过长，不能超过50个字符');
      }
      return true;
    }
    if (name === 'stock') {
      if (!isNumbers(value)) {
        throwError('库存设置不正确，请输入正确的值');
      }
      return true;
    }
  } catch (error) {
    message.warn(error.message);
    return undefined;
  }
}

export function validator(value, str) {
  try {
    if (value === '') return true;
    if (isNaN(value) || !/^\d+(\.\d{1,2})?$/gi.test(value)) {
      throwError(`${str || ''}必须为纯数字,且支持小数点后2位`);
    }
    if (Number(value) < 0 || Number(value) > 999999999.99) {
      throwError(`${str || ''}必须大于等于0，小于等于999999999.99`);
    }
    return true;
  } catch (error) {
    message.warn(error.message);
    return undefined;
  }
}
// 单规格数据处理
function setSimpleData(details) {
  try {
    const { supplyPrice, suggestPrice, marketPrice, barcode, weight, volume, stock } = details;

    if (!(supplyPrice || suggestPrice || marketPrice)) {
      return '商品相关价格未输入';
    }
    if (supplyPrice > suggestPrice || supplyPrice > marketPrice) {
      return '供货价不能大于市场价和建议零售价';
    }
    if (!validator(supplyPrice, '供货价')) {
      return undefined;
    }
    if (!validator(suggestPrice, '建议零售价')) {
      return undefined;
    }
    if (!validator(marketPrice, '市场价')) {
      return undefined;
    }
    details.supplyPrice = Number(supplyPrice);
    details.suggestPrice = Number(suggestPrice);
    details.marketPrice = Number(marketPrice);
    if (barcode && barcode.length > 50) {
      message.warn('商品条码过长，不能超过50');
    }
    if (weight && !validator(weight, '重量')) return undefined;
    if (volume && !validator(volume, '体积')) return undefined;
    if (stock && !checkNumberInput('stock', stock, '库存')) return undefined;
    details.volume = !volume ? 0 : Number(volume);
    details.stock = stock === '' || stock === undefined ? -1 : Number(stock);
    details.weight = !weight ? 0 : Number(weight);

    filterTheVideoImg(details);
    const data = skus();
    for (const name in data) {
      if (
        details[name] !== undefined ||
        name !== 'detailImages' ||
        name !== 'images' ||
        name !== 'video'
      )
        data[name] = details[name] || details[name] === 0 ? details[name] : '';
    }
    data.name = [];
    delete details.stock;
    delete details.suggestPrice;
    delete details.supplyPrice;
    delete details.volume;
    delete details.weight;
    delete details.marketPrice;
    details.skus = [{ ...data }];
    return true;
  } catch (error) {
    console.log(error);
    return error.message;
  }
}

// 提交表单
export function submitInfo(_this) {
  try {
    _this.setState({
      submitLoading: true,
    });
    const { dispatch } = _this.props;
    let { skusTableList, details, guideType } = _this.state;

    // 解决每次提交时，因数据形式变动导致的antdesign数据传入崩溃的问题
    details = JSON.parse(JSON.stringify(details));
    // details = { ...res, ...details };
    if (details.name === '') {
      throwError('商品名不能为空');
    }
    if (details.categoryId === '' || details.categoryId === undefined) {
      throwError('商品分类不能为空');
    }
    if (details.serviceCities.length < 1) {
      throwError('服务城市不能为空');
    }
    if (details.deliveryType === '') {
      throwError('发货方式不能为空');
    }
    if (guideType && skusTableList.length < 1) {
      throwError('开启多规格后，多规格数据不能为空');
    }
    if (details.images.length < 1) {
      throwError(`最少上传一张商品图`);
    }
    // 不同规格不同处理方式
    if (guideType) {
      // 多规格
      const res = setSubmitData(details, _this);
      if (res === undefined || res !== true) throwError(res);
    } else {
      // 单规格
      const res = setSimpleData(details);
      if (res === undefined || res !== true) throwError(res);
    }
    if (details.id) {
      dispatch({
        type: 'productModel/updateProduct',
        payload: { ...details },
        callback: () => {
          message.success('更新成功');
          history.goBack();
        },
      });
    } else {
      dispatch({
        type: 'productModel/addProduct',
        payload: { ...details },
        callback: () => {
          message.success('添加成功');
          history.goBack();
          // history.replace('/product/list/detail');
        },
      });
    }
  } catch (error) {
    _this.setState({
      submitLoading: false,
    });
    message.warn(error.message);
  }
}
