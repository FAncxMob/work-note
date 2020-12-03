import React, { useState } from 'react';
import { Input, Tooltip } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { setBusRemarks } from '../../service';

const { TextArea } = Input;

const Index = (props) => {
  const { value, orderId } = props;
  const [sellerRemark, setSellerRemark] = useState(value);
  const [openInput, setOpenInput] = useState(false);
  async function sendRemarks() {
    await setBusRemarks({
      orderId,
      remark: sellerRemark,
    });
    setOpenInput(false);
  }
  return (
    <div>
      {!openInput ? (
        <>
          <span>{`团长备注:${sellerRemark || '--'}`}</span>
          <Tooltip title="点击添加或编辑备注">
            <FormOutlined
              className="text-primary cup ml5"
              onClick={() => {
                setOpenInput(true);
              }}
            />
          </Tooltip>
        </>
      ) : (
        <TextArea
          value={sellerRemark}
          showCount
          placeholder="请输入团长备注"
          onInput={(e) => {
            setSellerRemark(e.target.value);
          }}
          onBlur={() => {
            sendRemarks();
          }}
          onPressEnter={() => {
            sendRemarks();
          }}
          maxLength={50}
        />
      )}
    </div>
  );
};

export default Index;
