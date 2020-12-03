import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import Config from '@/utils/config';

const { Option } = Select;
const { merchantAppUrl = [] } = Config;

const InnerLink = (props) => {
  const [linkVal, setLinkVal] = useState('');

  const { value, onChange = () => {} } = props;

  useEffect(() => {
    const { linkVal: oriLinkVal } = value;
    if (!oriLinkVal || oriLinkVal === linkVal) return;
    setLinkVal(oriLinkVal);
  }, [value]);

  function handleChange(val) {
    setLinkVal(val);
    onChange({ linkVal: val });
  }

  return (
    <Select
      placeholder="请选择"
      onChange={(val) => {
        handleChange(val);
      }}
      value={linkVal}
    >
      {merchantAppUrl.map((i) => (
        <Option key={i.url} value={i.url}>
          {i.pageName}
        </Option>
      ))}
    </Select>
  );
};

export default InnerLink;
