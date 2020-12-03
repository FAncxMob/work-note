import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

const Phone = (props) => {
  const [linkVal, setLinkVal] = useState('');

  const { value, onChange = () => {} } = props;

  useEffect(() => {
    const { linkVal: oriLinkVal } = value;
    if (!oriLinkVal || oriLinkVal === linkVal) return;
    setLinkVal(oriLinkVal);
  }, [value]);

  function handleInput(val) {
    setLinkVal(val);
    onChange({ linkVal: val });
  }

  return (
    <Input
      placeholder="请输入电话号码"
      value={linkVal}
      onChange={(e) => {
        handleInput(e.target.value);
      }}
    />
  );
};

export default Phone;
