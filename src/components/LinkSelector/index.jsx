import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import OutLink from './outLink';
import Phone from './phone';
import OutMiniProgram from './outMiniProgram';
import InnerLink from './innerLink';

const { Option } = Select;
const selectOptions = [
  { value: 'outLink', text: '外部链接' },
  { value: 'customerService', text: '客服' },
  { value: 'phone', text: '电话' },
  { value: 'outMiniProgram', text: '外部小程序' },
  { value: 'innerLink', text: '内部链接' },
];

const LinkSelector = (props) => {
  const [linkType, setLinkType] = useState('');
  const [linkOption, setLinkOption] = useState({});

  const { value = null, onChange = () => {} } = props;

  useEffect(() => {
    if (!value) return;
    const { linkType: oriLinkType, ...ret } = value;
    setLinkType(oriLinkType);
    setLinkOption(ret);
  }, [value]);

  function renderLinkComp(type) {
    switch (type) {
      case 'outLink':
        return <OutLink value={linkOption} onChange={(val) => handleChangeLinkOption(val)} />;
      case 'phone':
        return <Phone value={linkOption} onChange={(val) => handleChangeLinkOption(val)} />;
      case 'outMiniProgram':
        return (
          <OutMiniProgram value={linkOption} onChange={(val) => handleChangeLinkOption(val)} />
        );
      case 'innerLink':
        return <InnerLink value={linkOption} onChange={(val) => handleChangeLinkOption(val)} />;
      case 'customerService':
        return null;
      default:
        return null;
    }
  }

  function handleChangeLinkType(type) {
    if (type === linkType) return;
    setLinkType(type);
    setLinkOption({});
    onChange({ linkType: type });
  }

  function handleChangeLinkOption(val) {
    setLinkOption(val);
    onChange({ linkType, ...val });
  }

  return (
    <div>
      <div className="mb20">
        <Select
          placeholder="请选择"
          onChange={(val) => {
            handleChangeLinkType(val);
          }}
          value={linkType}
        >
          {selectOptions.map((i) => (
            <Option key={i.value} value={i.value}>
              {i.text}
            </Option>
          ))}
        </Select>
      </div>
      {renderLinkComp(linkType)}
    </div>
  );
};

export default LinkSelector;
