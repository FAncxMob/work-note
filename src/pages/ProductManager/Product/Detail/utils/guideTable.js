import React from 'react';
import { Input, Upload } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

import { signHeader } from '@/utils/sign';
import config from '../../../../../../app/config';

import { getCommission } from './utils';

import FileHandle from './file';

const uploadAction = config.uploadUrl;
// 表格列表title
export function multiGuideColumnsTable() {
  return [
    {
      title: '序号',
      key: '0',
      align: 'center',
      width: 75,
      render: (text, record, index) => <span> {index + 1}</span>,
    },
    {
      title: '供货价(元)',
      dataIndex: 'supplyPrice',
      key: '1',
      className: 'min-w120 guideRule',
      align: 'center',
      render: (text, record, index) => {
        return (
          <>
            <div className=" df justify-between">
              <Input
                defaultValue={text}
                placeholder="供货价"
                value={text}
                style={{ minWidth: '80px' }}
                onChange={(e) => {
                  this.handleInputSkusTable(e, 'supplyPrice', index, '供货价');
                }}
              />
              <p className="mb5 ml5">佣金{getCommission(text, this)}</p>
            </div>
          </>
        );
      },
    },
    {
      title: '建议价(元)',
      dataIndex: 'suggestPrice',
      key: '2',
      className: 'min-w100 guideRule',
      align: 'center',
      render: (text, record, index) => (
        <Input
          defaultValue={text}
          placeholder="建议售价"
          // style={{ minWidth: '80px' }}
          value={text}
          onChange={(e) => {
            this.handleInputSkusTable(e, 'suggestPrice', index, '建议售价');
          }}
        />
      ),
    },
    {
      title: '市场价(元)',
      dataIndex: 'marketPrice',
      key: '3',
      align: 'center',
      className: 'min-w100 guideRule',
      render: (text, record, index) => (
        <Input
          defaultValue={text}
          // style={{ minWidth: '80px' }}
          placeholder="市场价"
          value={text}
          onChange={(e) => {
            this.handleInputSkusTable(e, 'marketPrice', index, '市场价');
          }}
        />
      ),
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: '4',
      align: 'center',
      className: 'min-w80',
      render: (text, record, index) => (
        <Input
          defaultValue={text}
          // style={{ minWidth: '100px' }}
          placeholder={text === -1 || text === '' ? '不限' : '商品库存'}
          value={text}
          onChange={(e) => {
            this.handleInputSkusTable(e, 'stock', index, '库存');
          }}
        />
      ),
    },
    {
      title: '商品条形码',
      dataIndex: 'barcode',
      key: '5',
      align: 'center',
      className: 'min-w80',
      render: (text, record, index) => (
        <Input
          defaultValue={text}
          // style={{ minWidth: '100px' }}
          value={text}
          placeholder="商品条形码"
          onChange={(e) => {
            this.handleInputSkusTable(e, 'barcode', index, '商品条形码');
          }}
        />
      ),
    },
    {
      title: '重量(kg)',
      dataIndex: 'weight',
      className: 'min-w80',
      key: '6',
      align: 'center',
      render: (text, record, index) => (
        <Input
          defaultValue={text}
          value={text}
          placeholder="重量"
          // style={{ minWidth: '80px' }}
          onChange={(e) => {
            this.handleInputSkusTable(e, 'weight', index, '重量');
          }}
        />
      ),
    },
    {
      title: '体积(m³)',
      dataIndex: 'volume',
      align: 'center',
      className: 'min-w60',
      key: '7',
      render: (text, record, index) => (
        <Input
          defaultValue={text}
          value={text}
          placeholder="体积"
          // style={{ minWidth: '80px' }}
          onChange={(e) => {
            this.handleInputSkusTable(e, 'volume', index, '体积');
          }}
        />
      ),
    },
    {
      title: '图片',
      align: 'center',
      key: '8',
      render: (text, record, index) => {
        return (
          <div className="guideImg">
            <Upload
              action={uploadAction}
              listType="picture-card"
              data={{ appId: 'S' }}
              headers={signHeader()}
              className="productDetail"
              fileList={record.image}
              // showUploadList={false}
              onRemove={(e) => FileHandle.handleRemove(e, 'skusTableList', 'image', index)}
              onPreview={(e) => {
                this.handlePreview(e);
              }}
              onChange={(e) => FileHandle.handleUpChange(e, 'skusTableList', 'image', index)}
              beforeUpload={(e) => FileHandle.beforeUpload(e, { type: 'image' })}
              onSuccess={(e) => {
                FileHandle.handleSuccess(e, 'skusTableList', 'image', index);
              }}
            >
              {record.image.length > 0 ? null : <FileImageOutlined className="fz16" />}
            </Upload>
          </div>
        );
      },
    },
  ];
}
