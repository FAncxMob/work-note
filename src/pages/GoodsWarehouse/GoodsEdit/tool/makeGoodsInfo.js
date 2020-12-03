import { tableInputList } from './config';

export default function makeGoodsInfo(data) {
  const { name = '', categoryIds = [], deliveryType = '', desc = '', skuType } = data;

  let {
    detailImages = [],
    images = [],
    video: videoFiles = [],
    videoImage: videoImageFiles = [],
  } = data;

  detailImages = batchHandleMediaFilePath(detailImages);
  images = batchHandleMediaFilePath(images);
  videoFiles = batchHandleMediaFilePath(videoFiles);
  videoImageFiles = batchHandleMediaFilePath(videoImageFiles);

  const [video = ''] = videoFiles;
  const [videoImage = ''] = videoImageFiles;
  let { saleStatus } = data;
  saleStatus = Number(!!saleStatus);

  let skuInfo;
  if (skuType === 'single') {
    skuInfo = makeSkuInfoBySingle(data);
  } else {
    skuInfo = makeSkuInfoByMore(data);
  }
  return {
    name,
    categoryIds,
    deliveryType,
    desc,
    detailImages,
    images,
    video,
    videoImage,
    saleStatus,
    ...skuInfo,
  };
}

function makeSkuInfoBySingle(data) {
  const { limit = '', marketPrice = '', sales = '', singleId = '' } = data;
  let { stock = -1 } = data;
  if (stock === '' || stock === null) {
    stock = -1;
  }
  return {
    skuAttrs: [],
    skus: [
      {
        id: singleId,
        sales,
        marketPrice,
        stock,
        limit,
      },
    ],
  };
}

function makeSkuInfoByMore(data) {
  const {
    moreSku: { skuAttrs = [], skus = [] },
  } = data;

  let skuList = makeupSkuListInfo(skus, data, tableInputList);
  skuList = skus.map(formatSkuItem);

  return {
    skuAttrs,
    skus: skuList,
  };
}

function formatSkuItem(data) {
  const {
    id = '',
    image: imageFiles = [],
    limit = '',
    sales = '',
    marketPrice = '',
    name = [],
  } = data;
  let { stock = -1 } = data;
  if (stock === '' || stock === null) {
    stock = -1;
  }

  const image = getMediaFilePath(imageFiles[0]);

  return {
    id,
    image,
    limit,
    sales,
    marketPrice,
    name,
    stock,
  };
}

function makeupSkuListInfo(skuList, data, props) {
  skuList.forEach((s) => {
    props.forEach((k) => {
      s[k] = data[`${[...s.name, k].join('|')}`];
    });
  });
  return skuList;
}

function getMediaFilePath(data = '') {
  if (typeof data === 'string') return data;

  if (data.status) return '';
  return data.filePath;
}

function batchHandleMediaFilePath(list) {
  return list.map((i) => getMediaFilePath(i)).filter((i) => i);
}
