import React from 'react';
import { SmileOutlined } from '@ant-design/icons';

const Welcome = () => (
  <div className="mt150 text-center">
    <SmileOutlined style={{ fontSize: '150px' }} />
    <p style={{ fontSize: '40px', marginTop: '10px' }}>欢迎来到火品店铺管理平台!</p>
  </div>
);

export default Welcome;
