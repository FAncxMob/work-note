import React from 'react';
import { Form, Input, Select, Switch, DatePicker } from 'antd';
import RangePicker31Date from '@/components/RangePicker31Date';

const { RangePicker } = DatePicker;

const { Option } = Select;

const InputGroup = (props) => {
  const { beforeItemProps, beforeElProps, afterItemProps, afterElProps, compact = true } = props;

  const createFromEl = (elProps) => {
    const { type, elOptions, optionData } = elProps;
    switch (type) {
      case 'input':
        return <Input {...elOptions} />;
      case 'switch':
        return <Switch {...elOptions} />;
      case 'select':
        return (
          <Select {...elOptions}>
            {optionData.map((i) => (
              <Option key={i.value} value={i.value}>
                {i.text}
              </Option>
            ))}
          </Select>
        );
      case 'datePicker':
        return <DatePicker {...elOptions} />;
      case 'rangePicker':
        return <RangePicker {...elOptions} />;
      case 'max31Date':
        return <RangePicker31Date {...elOptions} />;
      default:
        return <Input {...elOptions} />;
    }
  };

  return (
    <Input.Group compact={compact}>
      <Form.Item {...beforeItemProps}>{createFromEl(beforeElProps)}</Form.Item>
      <Form.Item {...afterItemProps}>{createFromEl(afterElProps)}</Form.Item>
    </Input.Group>
  );
};
export default InputGroup;
