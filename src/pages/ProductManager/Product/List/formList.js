import { deliverWayMap, shelveStatusMap, auditStatusMap } from '../utils';

const deliverWayMaps = [...deliverWayMap];
deliverWayMaps.unshift({ value: '', label: '全部', color: '' });
// 头部数据筛选表单
export const formList = (cityTree) => {
  return [
    {
      type: 'input',
      name: 'name',
      label: '商品名称',
      elOptions: {
        allowClear: true,
        placeholder: '请输入商品名称',
      },
      formItemOption: {
        className: 'mb10',
      },
    },
    // {
    //   type: 'radio',
    //   name: 'deliveryType',
    //   label: '发货方式',
    //   elOptions: {
    //     options: deliverWayMaps,
    //     optionType: 'button',
    //     buttonStyle: 'solid',
    //     size: 'middle',
    //   },
    // },
    // {
    //   type: 'select',
    //   name: 'shelveStatus',
    //   label: '上架状态',
    //   elOptions: {
    //     className: 'min-w120',
    //     placeholder: '请选择状态',
    //   },
    //   optionData: shelveStatusMap,
    //   formItemOption: {
    //     className: 'mb10',
    //   },
    // },
    // {
    //   type: 'select',
    //   name: 'auditStatus',
    //   label: '审核状态',
    //   elOptions: {
    //     className: 'min-w120',
    //     placeholder: '请选择状态',
    //   },
    //   optionData: auditStatusMap,
    //   formItemOption: {
    //     className: 'mb10',
    //   },
    // },
    // {
    //   type: 'select',
    //   name: 'serviceCities',
    //   label: '服务城市',
    //   elOptions: {
    //     showSearch: true,
    //     className: 'min-w120',
    //     placeholder: '请选择城市',
    //   },
    //   optionData: cityTree,
    //   formItemOption: {
    //     className: 'mb10',
    //   },
    // },
  ];
};
