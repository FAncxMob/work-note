import React from 'react';
import { Form, Input, Select, Switch, DatePicker, Cascader, TreeSelect, Radio } from 'antd';
import RangePicker31Date from '@/components/RangePicker31Date';

const { RangePicker } = DatePicker;

const { TextArea } = Input;

const { Option } = Select;
const createFromEl = (item) => {
  const { type, el, elOptions = {}, optionData = {}, selectAll = true } = item;
  /**
   * @param optionData.value Option的值
   * @param optionData.text Option的显示内容
   */

  if (el) {
    return el;
  }
  switch (type) {
    case 'input':
      return <Input {...elOptions} />;
    case 'textarea':
      return <TextArea {...elOptions} />;
    case 'switch':
      return <Switch {...elOptions} />;
    case 'select':
      return (
        <Select {...elOptions}>
          {selectAll ? <Option value="">全部</Option> : null}
          {optionData.map((i) => (
            <Option key={i.value} value={i.value}>
              {i.text}
            </Option>
          ))}
        </Select>
      );
    case 'datePicker':
      return <DatePicker {...elOptions} />;
    case 'radioGroup':
      return (
        <Radio.Group {...elOptions}>
          {optionData.map((i) => (
            <Radio value={i.value} key={i.value}>
              {i.text}
            </Radio>
          ))}
        </Radio.Group>
      );
    case 'radio':
      return <Radio.Group {...elOptions} />;
    case 'rangePicker':
      return <RangePicker {...elOptions} />;
    case 'max31Date':
      return <RangePicker31Date {...elOptions} />;
    case 'cascader':
      return <Cascader {...elOptions} />;
    case 'treeSelect':
      return <TreeSelect {...elOptions} />;
    case 'textArea':
      return <TextArea {...elOptions} />;
    default:
      return <Input {...elOptions} />;
  }
};

const createFormItem = (props) => {
  const { FormList = [] } = props;
  return FormList.map((item, index) => {
    const {
      name = index,
      extra: itemExtra,
      formItemOption = {},
      label,
      hide,
      aroundForm = false,
      el,
      rule,
    } = item;
    if (hide) return null;

    if (aroundForm && el) return el;

    const EL = createFromEl(item);
    return (
      <Form.Item
        name={name}
        rules={rule}
        extra={itemExtra}
        {...formItemOption}
        key={name}
        label={label}
      >
        {EL}
      </Form.Item>
    );
  });
};

export default createFormItem;
