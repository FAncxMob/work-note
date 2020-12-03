export const deliverWayMap = [
  { value: 0, label: '一件代发', color: '' },
  { value: 1, label: '到中心仓', color: '' },
];
export const shelveStatusMap = [
  { value: 0, text: '未上架', color: '' },
  { value: 1, text: '上架申请中', color: 'yellow' },
  { value: 2, text: '已上架', color: 'green' },
  { value: 3, text: '已下架', color: 'blue' },
];

export const auditStatusMap = [
  { value: 0, text: '未审核', color: '' },
  { value: 1, text: '待审核', color: 'yellow' },
  { value: 2, text: '审核成功', color: 'green' },
  { value: 3, text: '审核失败', color: 'red' },
];
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export function deliverWay(val) {
  if (val === 0) return '一件代发';
  if (val === 1) return '到中心仓';
}
export function stockStatus(val) {
  if (val === -1) return '不限';
  if (val === 0 || val) return val;
  if (!val) return '--';
}

export const initForm = () => {
  return {
    currentPage: 1,
    pageSize: 20,
    name: '',
    deliveryType: '',
    categoryIds: '',
    serviceCities: '',
    auditStatus: '',
    shelveStatus: '',
  };
};
