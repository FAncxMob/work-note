export const settingsMap = [
  { value: 0, label: '批量设置供货价' },
  { value: 1, label: '批量设置建议售价' },
  { value: 2, label: '批量设置市场价' },
  { value: 3, label: '批量设置库存' },
  { value: 4, label: '批量设置商品条码' },
  { value: 5, label: '批量设置重量' },
  { value: 6, label: '批量设置体积' },
];
// 初始化数据
export function initData() {
  return {
    name: '', // 商品名称
    // supplierId: '', // 供应商id
    categoryId: '', // 商品分类id
    tags: ['限时秒杀', '热卖'], // 商品标签
    serviceCities: [], // 服务城市
    desc: '', // 商品描述
    deliveryType: '', // 发货方式
    skuAttrs: [], // 多规格属性: 格式：“颜色,尺码”
    skus: [], // 多规格
    supplyPrice: '', // 供货价
    suggestPrice: '', // 建议零售价
    marketPrice: '', // 市场价
    barcode: '', // 商品条码
    weight: '', // 重量
    volume: '', // 体积
    stock: '', // 库存
    images: [], // 商品图
    detailImages: [], // 详情图
    video: [], // 商品视频
  };
}
// 多规格数据内容
export function skus() {
  return {
    name: '', // 规格名称
    supplyPrice: '', // 供货价
    suggestPrice: '', // 建议零售价
    marketPrice: '', // 市场价
    barcode: '', // 商品条码
    weight: '', // 重量
    volume: '', // 体积
    image: '', // 图片
    stock: '', // 库存
  };
}
// 具体规格
export function skuItem() {
  return { skuName: '' };
}
// 规格分类
export function guideTypeData() {
  return {
    title: '',
    skus: [skuItem()],
  };
}
