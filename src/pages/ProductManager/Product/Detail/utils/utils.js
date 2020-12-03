import UFF from '@/utils/UFF';
import { message } from 'antd';
import { skus, skuItem } from './init';
import { validator } from './submit';
// 格式化获取的详情数据
export function toSetDetailModel(data, _this) {
  try {
    const { details } = _this.state;
    let guideType = false;
    let hasSkuAttrs = false;
    let columns = [];
    const guideData = {
      skusType: [],
      skusTableList: [],
    };
    // 多贵的条件成立，展现多规格相关数据
    if (data.skuAttrs && data.skuAttrs.length > 0) {
      guideType = true;
      hasSkuAttrs = true;
      setDataInShow(data.skuAttrs, data.skus, guideData);
      data.skus.forEach((item) => {
        const { volume, stock, weight } = item;
        item.volume = volume > 0 ? volume : '';
        item.stock = stock >= 0 ? stock : '';
        item.weight = weight > 0 ? weight : '';
      });
      guideData.skusTableList = data.skus;
      columns = _this.skusTableConcatData(guideData.skusType);
    } else {
      const skuData = data.skus[0];
      details.barcode = skuData.barcode;
      details.volume = skuData.volume || '';
      details.stock = skuData.stock >= 0 ? skuData.stock : '';
      details.weight = skuData.weight || '';
      details.supplyPrice = skuData.supplyPrice;
      details.suggestPrice = skuData.suggestPrice;
      details.marketPrice = skuData.marketPrice;
    }
    details.id = data.id;
    for (const name in details) {
      if (data[name] || data[name] === 0) {
        if (name === 'stock' || name === 'deliveryType') {
          details[name] = data[name] >= 0 ? data[name] : '';
        } else if (name === 'images' || name === 'detailImages' || name === 'video') {
          if (data[name].length > 0) {
            // 处理图片数据，适应框架数据显示结构
            details[name] = setTheImagesData(data[name], name);
          } else {
            details[name] = [];
          }
        } else {
          details[name] = data[name] || '';
        }
      }
    }
    _this.setState(
      {
        details,
        guideType,
        hasSkuAttrs,
        columns,
        ...guideData,
      },
      () => {
        const { categoryTree } = _this.props.productModel;
        filterCurrentCommission(details.categoryId, categoryTree, _this);
      },
    );
  } catch (error) {
    console.log(error);
    message.error(error.message, '详情数据处理出错');
  }
}
// 处理获取详情的相关图片或视频
function setTheImagesData(arr, type = 'image') {
  if (type === 'video') {
    const url = UFF.getVideoImg(arr, 86, 86);
    arr = [{ url, subUrl: arr, uid: 0, sourceType: 'video' }];
  }
  return arr.map((item, index) => ({
    url: UFF.getPosterHi(item),
    subUrl: item,
    uid: index,
    sourceType: type,
  }));
}

// 组装多规格数据，适应显示结构
function setDataInShow(skuAttrs, skus, guideData) {
  skuAttrs.forEach((item, index) => {
    guideData.skusType[index] = { title: item, skus: [] };
  });

  skus.forEach((item) => {
    item.image = item.image ? setTheImagesData([item.image]) : [];
    item.name.forEach((item2, index2) => {
      guideData.skusType[index2].skus.push(item2);
    });
  });
  // 去重具体规格数据
  skuAttrs.forEach((item, index) => {
    const skusArr = guideData.skusType[index].skus;

    guideData.skusType[index].skus = Array.from(new Set(skusArr)).map((item2) => {
      const skuItemObj = skuItem();
      skuItemObj.skuName = item2;
      return skuItemObj;
    });
  });
}

// 过滤出当前分类下的佣金比例
export function filterCurrentCommission(id, arr, _this) {
  for (const item of arr) {
    if (item.value === id) {
      _this.setState({
        currentCommission: item.platformCommissionRate,
      });
      break;
    } else if (item.children && item.children.length > 0) {
      filterCurrentCommission(id, item.children, _this);
    }
  }
}
// 设置规格在表格中的展示
export function getSkusTableByRecursion(listData, obj1, obj2) {
  // 有副规格
  if (obj2) {
    let i = 0;
    obj2.skus.forEach((item2, index2) => {
      obj1.skus.forEach((item, index) => {
        listData[i] = { ...skus() };
        listData[i].key = `${index2}${index}`;
        listData[i].name = [item.skuName, item2.skuName];
        i++;
      });
    });
  } else {
    // 只有主规格
    if (!obj1) return;
    obj1.skus.forEach((item, index) => {
      listData[index] = { ...skus() };
      listData[index].key = `${index}`;
      listData[index].name = [item.skuName];
    });
  }
}
// 计算佣金
export function getCommission(val, _this) {
  const { currentCommission } = _this.state;
  const count = parseFloat(val);
  if (!val || Array.isArray(count)) {
    return 0;
  }
  const num = ((count * currentCommission) / 100).toFixed(2);
  return num;
}
// 批量设置的值
export function handleSettingsChangeInput(e, _this) {
  const { value } = e.target;
  if (_this.settingTableType !== 4) {
    // 非条形码
    if (_this.settingTableType === 3) {
      // 库存
      if (isNumbers(value)) {
        _this.settingTableTypeValue = value;
      } else {
        message.warn('库存设置不正确，请输入正确的值');
      }
    } else if (validator(value)) _this.settingTableTypeValue = value;
  } else {
    _this.settingTableTypeValue = value;
  }
}
// 验证大于0纯数字
export function isNumbers(val) {
  if (val === '') return true;
  if (isNaN(val) || !/^\d+$/.test(val)) return false;
  if (Number(val) > 999999999 || Number(val) < 0) return false;
  return true;
}
// 移除对应商品标签
export function deleteTag(e, _this) {
  const tags = _this.state.details.tags.filter((item) => item !== e);
  _this.setState((state) => (state.details.tags = tags));
}
