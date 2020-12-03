import { statusTypeMaps } from '../../../init';
// 头部数据筛选表单
export const formList = ({ groupList, onSearch, onChange }) => {
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
      type: 'radio',
      name: 'statusType',
      label: '筛选方式',
      elOptions: {
        onChange,
        options: statusTypeMaps,
        optionType: 'button',
        buttonStyle: 'solid',
        size: 'middle',
      },
    },
    {
      type: 'select',
      name: 'groupId',
      label: '所属团购',
      elOptions: {
        showSearch: true,
        className: 'min-w195',
        placeholder: '请选择团购',
        onSearch,
      },
      optionData: groupList || [],
      formItemOption: {
        className: 'mb10',
      },
    },
  ];
};
