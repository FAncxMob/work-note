import { tableInputList } from './config';

export default function analysisGoodsInfo(data) {
  const {
    skus,
    skuAttrs,
    detailImages = [],
    video,
    videoImage,
    categoryList = [],
    stock: oriStock,
    typeList = [], // 分类列表
    ...r
  } = data;

  let singleInfo = {};
  let moreSku = {};
  let skuTableValue = {};
  if (!skuAttrs.length) {
    singleInfo = analysisSingleInfo(skus[0]);
  } else {
    moreSku = analysisSkuInfo(data);
    skuTableValue = analysisTableValue(moreSku.skus, tableInputList);
  }

  return {
    moreSku,
    skuType: skuAttrs.length > 0 ? 'moreSku' : 'single',
    detailImages,
    video: [video].filter((i) => i),
    videoImage: [videoImage].filter((i) => i),
    categoryIds: categoryList
      .map((i) => i.categoryId)
      .filter((i) => typeList.some((t) => t.id === i)), // 需要过滤已删除的分类
    stock: oriStock < 0 ? '' : oriStock,
    ...r,
    ...singleInfo,
    ...skuTableValue,
  };
}

// 解析单规格商品信息
function analysisSingleInfo(data) {
  const { id: singleId, sales, limit, marketPrice } = data;
  let { stock } = data;
  if (stock < 0) {
    stock = '';
  }

  return {
    stock,
    singleId,
    sales,
    limit,
    marketPrice,
  };
}

// 解析多规格商品信息
function analysisSkuInfo(data) {
  const { skus, skuAttrs } = data;

  const mainSet = new Set();
  const secondSet = new Set();

  const list = skus.map((i) => {
    const { name = [], image, stock: orgStock, ...ret } = i;
    const [mainSpec = '', secondSpec = ''] = name;
    mainSet.add(`${mainSpec}|${image}`);
    secondSet.add(secondSpec);

    return {
      mainSpec,
      secondSpec,
      name,
      stock: orgStock < 0 ? '' : orgStock,
      ...ret,
    };
  });

  const mainList = [...mainSet].map((i) => {
    const [mainSpec, image] = i.split('|');
    return { name: mainSpec, image: [image].filter((j) => j) };
  });

  const secondList = [...secondSet].map((i) => {
    return { name: i };
  });

  return {
    skuAttrs,
    skus: list,
    skuLabelItem: [mainList, secondList],
  };
}
// 解析组装多规格商品table 指定列input输入框的值
function analysisTableInputVal(list, propName) {
  const data = {};
  list.forEach((i) => {
    data[`${[...i.name, propName].join('|')}`] = i[propName];
  });
  return data;
}

// 解析组装多规格商品table的值
function analysisTableValue(list, props) {
  let data = {};
  props.forEach((i) => {
    const info = analysisTableInputVal(list, i);
    data = { ...data, ...info };
  });
  return data;
}
