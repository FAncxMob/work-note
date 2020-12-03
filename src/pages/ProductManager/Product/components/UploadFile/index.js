import React, { useState, useEffect } from 'react';
import { Upload } from 'antd';
import { FileImageOutlined, PlaySquareOutlined } from '@ant-design/icons';

const UploadFile = (props) => {
  const {
    fileList,
    handleChange,
    handlePreview,
    beforeUpload,
    text = '上传图片',
    uploadType = 'img',
  } = props;

  const uploadButton = () => (
    <div>
      {uploadType === 'img' ? (
        <FileImageOutlined className="fz30" />
      ) : (
        <PlaySquareOutlined className="fz30" />
      )}
      <div style={{ marginTop: 8 }}>{text}</div>
    </div>
  );

  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      listType="picture-card"
      fileList={fileList}
      onPreview={handlePreview}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {fileList ? null : uploadButton()}
    </Upload>
  );
};
export default UploadFile;
