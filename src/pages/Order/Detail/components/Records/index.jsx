import React from 'react';
import { Form, Image } from 'antd';
import Uff from '@/utils/UFF';

const REFUSEURL = require('@/images/defaultShopLogo.jpg');

const Index = (props) => {
  const { applyDesc, applyImg, reason } = props.data;

  return (
    <>
      <p className="fz16 fwb mb5">申请信息</p>
      <Form>
        <Form.Item label="申请原因：" className="mb5">
          <p className="fz16 mb5 word-break">{reason || '--'}</p>
        </Form.Item>
        <Form.Item label="买家描述：" className="mb5">
          <p className="fz16 mb5 word-break">{applyDesc || '--'}</p>
        </Form.Item>
        <Form.Item label="申请图片：" className="mb5">
          {applyImg ? (
            <Image width={60} className="mr5" src={Uff.getOrderListImage(applyImg)} />
          ) : (
            '--'
          )}
        </Form.Item>
      </Form>
    </>
  );
};
export default Index;
