import { Prompt } from 'react-router-dom';
import React, { useEffect } from 'react';

const MyPrompt = (props) => {
  const { when, message = '离开当前页后，所编辑的数据将不可恢复' } = props;
  const listener = (e) => {
    e.preventDefault();
    e.returnValue = message; // 浏览器有可能不会提示这个信息，会按照固定信息提示
  };

  useEffect(() => {
    if (when) {
      window.addEventListener('beforeunload', listener);
    } else {
      window.removeEventListener('beforeunload', listener);
    }
  }, [when]);

  useEffect(() => {
    return componentWillUnmount;
  }, []);

  function componentWillUnmount() {
    window.removeEventListener('beforeunload', listener);
  }

  return <Prompt when={when} message={() => message} />;
};

export default MyPrompt;
