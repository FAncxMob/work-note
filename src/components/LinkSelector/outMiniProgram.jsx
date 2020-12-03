import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

const OutMiniProgram = (props) => {
  const [appId, setAppId] = useState('');
  const [pageUrl, setPageUrl] = useState('');

  const { value, onChange = () => {} } = props;

  useEffect(() => {
    const { linkVal: oriLinkVal = '' } = value;
    if (!oriLinkVal) return;
    const [newAppId = '', newPageUrl = ''] = oriLinkVal.split('|');
    setPageUrl(newPageUrl);
    setAppId(newAppId);
    // setLinkVal(oriLinkVal);
  }, [value]);

  function handleInputAppId(val) {
    setAppId(val);
    onChange({ linkVal: `${val}|${pageUrl}` });
  }

  function handleInputPageUrl(val) {
    setPageUrl(val);
    onChange({ linkVal: `${appId}|${val}` });
  }

  return (
    <>
      <Input
        className="mb10"
        placeholder="请输小程序appId"
        value={appId}
        onChange={(e) => {
          handleInputAppId(e.target.value);
        }}
      />
      <Input
        placeholder="请输小程序页面路径"
        value={pageUrl}
        onChange={(e) => {
          handleInputPageUrl(e.target.value);
        }}
      />
    </>
  );
};

export default OutMiniProgram;
