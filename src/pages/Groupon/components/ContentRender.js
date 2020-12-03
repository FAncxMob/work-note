/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import { Card, Input, Upload, Button } from 'antd';
import {
  AppstoreOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import DragUpload from '@/components/DragUpload/index';
import config from '@/utils/config';
import { signHeader } from '@/utils/sign';
import UFF from '@/utils/UFF';
import { beforeUpload } from '@/utils/beforeUpload';

import styles from '../index.less';

const { uploadUrl } = config;
const { TextArea } = Input;

const actionMap = [
  { type: 'up', text: '上移' },
  { type: 'down', text: '下移' },
  { type: 'top', text: '置顶' },
  { type: 'delete', text: '删除' },
];

const addMap = [
  { type: 'multiple', icon: <AppstoreOutlined className="fz26" />, text: '小图' },
  { type: 'single', icon: <PictureOutlined className="fz26" />, text: '大图' },
  { type: 'video', icon: <VideoCameraOutlined className="fz26" />, text: '视频' },
  { type: 'text', icon: <EditOutlined className="fz26" />, text: '文字' },
];

const ContentRender = (props) => {
  const { value, onChange } = props;

  const [contentData, setContentData] = useState([]);

  function handleAddViewData(type) {
    const defaultViewData = {
      key: 'image',
      type: 'multiple',
      value: [],
    };
    switch (type) {
      case 'single':
        defaultViewData.type = 'single';
        break;
      case 'video':
        defaultViewData.key = 'video';
        defaultViewData.value = '';
        delete defaultViewData.type;
        break;
      case 'text':
        defaultViewData.key = 'text';
        defaultViewData.value = '';
        delete defaultViewData.type;
        break;
      default:
        console.log(type);
    }
    contentData.push(defaultViewData);
    setContentData([...contentData]);
  }

  function handleChange(file, index) {
    const changeValue = file.file;
    contentData[index].value.push(changeValue);
    setContentData([...contentData]);
  }

  async function handleSuccess({ filePath, fileUrl }) {
    // 现每次只允许传一个文件，故将对象中的uploading状态的文件修改状态并赋值即可
    contentData.forEach((i) => {
      if (!Array.isArray(i.value)) return;
      i.value = i.value.map((item, index) => {
        if (item.status !== 'uploading') return item;
        return {
          uid: index,
          url: UFF.getGroupContentImage(filePath),
          subUrl: fileUrl,
        };
      });
    });
    await setContentData([...contentData]);
    onChange(contentData);
  }

  function handleAction(type, index) {
    console.log(type, index);
  }

  function localActionContent(index) {
    return (
      <>
        {actionMap.map((item) => (
          <Button
            key={item.type}
            size="small"
            onClick={() => handleAction(item.type, index)}
            className="ml5"
          >
            {item.text}
          </Button>
        ))}
      </>
    );
  }

  useEffect(() => {
    value.forEach((item) => {
      const { key, value: source } = item;
      if (key === 'image') {
        item.value = source.map((item, index) => ({
          uid: index,
          url: UFF.getGroupContentImage(item),
          subUrl: item,
        }));
      }
    });
    setContentData(value);
  }, [value]);

  function imageContent(source, index, type) {
    if (type === 'multiple')
      return (
        <DragUpload
          action={uploadUrl}
          listType="picture-card"
          fileList={source}
          data={{ appId: 'S' }}
          headers={signHeader()}
          onChange={(e) => handleChange(e, index)}
          beforeUpload={{ type: 'image' }}
          onSuccess={(e) => handleSuccess(e.data, index)}
        >
          {source.length >= 9 ? null : <PlusOutlined className="fz30" />}
        </DragUpload>
      );
    return (
      <Upload
        action={uploadUrl}
        listType="picture-card"
        fileList={source}
        data={{ appId: 'S' }}
        headers={signHeader()}
        onChange={(e) => handleChange(e, index)}
        beforeUpload={(file) => beforeUpload(file, { type: 'image' })}
        onSuccess={(e) => handleSuccess(e.data, index)}
      >
        {source.length ? null : <PlusOutlined className="fz30" />}
      </Upload>
    );
  }

  function videoContent(source, index) {
    console.log(source, index);
  }

  function textContent(source, index) {
    console.log(source, index);
  }

  function viewContent() {
    return (
      <>
        {contentData.map(({ key, type, value: source }, index) => {
          let title = '';
          let dataView = null;
          switch (key) {
            case 'image':
              title = type === 'multiple' ? '小图' : '大图';
              dataView = imageContent(source, index, type);
              break;
            case 'video':
              title = '视频';
              dataView = videoContent(source, index);
              break;
            case 'text':
              title = '文字';
              dataView = textContent(source, index);
              break;
            default:
              console.log(key);
          }
          return (
            <Card
              title={title}
              key={index}
              bodyStyle={{ padding: '10px 15px' }}
              extra={localActionContent(index)}
              className={`${styles.contentCard} ${index === 0 ? '' : 'mt20'}`}
            >
              {dataView}
            </Card>
          );
        })}
      </>
    );
  }
  return (
    <>
      {contentData.length ? (
        viewContent()
      ) : (
        <TextArea placeholder="请输入团购内容" autoSize={{ minRows: 2, maxRows: 4 }} />
      )}
      <div className="df w200 justify-between mt15">
        {addMap.map(({ type, icon, text }) => (
          <div
            key={type}
            className="df flex-column justify-center color999 cup"
            onClick={() => handleAddViewData(type)}
          >
            {icon}
            <span className="fz12">{text}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ContentRender;
