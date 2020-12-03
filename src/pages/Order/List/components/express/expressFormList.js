import { getOrderStatus } from '../../../utils';
import { hasRemarksMap } from '../../../init';

const orderStatusMap = getOrderStatus();

const statusTypeMaps = [{ value: 2, label: '团员备注', color: '' }];
statusTypeMaps.unshift({ value: '', label: '全部', color: '' });
// 头部数据筛选表单
export const formList = ({ groupList, onSearch }) => {
  return [
    {
      type: 'input',
      name: 'orderId',
      label: '订单编号',
      elOptions: {
        allowClear: true,
        placeholder: '请输入订单ID',
      },
      formItemOption: {
        className: 'mb10',
      },
    },
    {
      type: 'select',
      name: 'groupId',
      label: '所属团购',
      elOptions: {
        showSearch: true,
        allowClear: true,
        className: 'min-w195',
        placeholder: '请选择团购',
        filterOption: false,
        onSearch,
      },
      optionData: groupList || [],
      formItemOption: {
        className: 'mb10',
      },
    },
    // {
    //   type: 'select',
    //   name: 'orderStatus',
    //   label: '订单状态',
    //   elOptions: {
    //     showSearch: true,
    //     allowClear: true,
    //     className: 'min-w195',
    //     placeholder: '请选择订单状态',
    //   },
    //   optionData: orderStatusMap,
    //   formItemOption: {
    //     className: 'mb10',
    //   },
    // },
    {
      type: 'radio',
      name: 'remark',
      label: '筛选备注',
      elOptions: {
        className: 'min-w195',
        options: hasRemarksMap,
        optionType: 'button',
        buttonStyle: 'solid',
      },
      formItemOption: {
        className: 'mb10',
      },
    },
  ];
};
