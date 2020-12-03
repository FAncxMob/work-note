import React from 'react';
import {
  EyeOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  FileOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { message, Progress } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import UFF from '@/utils/UFF';
import { throwError } from '@/utils/error';
import styles from './index.less';

export const ThemeContext = React.createContext('uploader');

export const SortableList = SortableContainer(({ fileList }) => {
  return (
    <div className="sort-table-list-wrap">
      {fileList.map((value, index) => (
        <SortableItem key={value.id} index={index} value={value} />
      ))}
    </div>
  );
});
// error uploading done（图片上传成功） 不存在(图片加载完)
export const Item = (file) => {
  const { status, percent, name, id } = file;
  return (
    <ThemeContext.Consumer key={id}>
      {(propsContext) => {
        const { space, width, height, isVertical, drag, mode } = propsContext;
        return (
          <>
            <div
              className={[
                drag ? 'cursor-move' : '',
                styles.preview,
                mode === 'replace' ? 'poa z-index-20' : 'por',
                'border-base vertical-middle',
                isVertical ? 'db' : 'dib',
              ].join(' ')}
              style={!status ? { margin: space } : { margin: space, width, height }}
            >
              {!status ? <ImgContent propsContext={propsContext} file={file} /> : null}
              {status === 'uploading' || status === 'done' ? (
                <div className="uploading-error-wrap">
                  文件上传中
                  <Progress percent={percent} size="small" showInfo={false} className="mt5" />
                </div>
              ) : null}
              {status === 'error' ? (
                <div className="uploading-error-wrap text-danger">
                  <FileOutlined className="fz30" />
                  <p className="text-ellipsis w100p mt10">{name}</p>
                </div>
              ) : null}
              {status !== 'uploading' ? (
                <MaskContent propsContext={propsContext} file={file} />
              ) : null}
              {/* 上传文件时不能删除 */}
            </div>
          </>
        );
      }}
    </ThemeContext.Consumer>
  );
};
export const SortableItem = SortableElement(({ value: file }) => Item(file));

// 图片
const ImgContent = ({ propsContext, file: { filePath, id, transferUrl } }) => {
  const { width, height } = propsContext;
  const isVideo = /td-videos/.test(filePath); // 视频
  return (
    <div className="uploader-img-wrap dib por">
      {isVideo ? (
        <div className="poa poa-center df-center bgc-mask fz30 icon-play">
          <PlayCircleOutlined />
        </div>
      ) : null}
      <img
        className="fz0 max-w100p max-h100p"
        src={transferUrl}
        alt=""
        data-id={id}
        style={{ width, height }}
      />
    </div>
  );
};

// 鼠标hover显示功能遮罩
const MaskContent = ({ propsContext, file }) => {
  const { filePath, id, status } = file;
  const { onPreview, onDelete, onUpload, mode } = propsContext;
  return (
    <>
      <div className="poa poa-center df-center fz20 bgc-mask uploader-mask-wrap">
        {!status ? (
          <a className="p8 icon-a fz20" data-file-path={filePath} data-id={id} onClick={onPreview}>
            <EyeOutlined />
          </a>
        ) : null}
        <a className="p8 icon-a" data-file-path={filePath} data-id={id} onClick={onDelete}>
          <DeleteOutlined />
        </a>
        {mode === 'replace' ? (
          <a className="p8 icon-a" data-file-path={filePath} data-id={id} onClick={onUpload}>
            <UploadOutlined />
          </a>
        ) : null}
      </div>
    </>
  );
};

export const transferImgUrl = (filePath = '', isGetOrigin) => {
  const isVideo = /td-videos/.test(filePath); // 视频
  const isNoThumb = !!isGetOrigin; // 宽高不等，故获取原图
  let url = isVideo ? UFF.getVideoImg(filePath, 0, 0) : UFF.prefix(filePath);
  if (!isNoThumb) {
    url = isVideo ? UFF.getVideoImg(filePath) : UFF.getThumb(filePath);
  }
  return url;
};
export const loadedImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image(); // 创建一个Image对象，实现图片的预下载
    img.onload = () => {
      img.onload = null;
      resolve('loaded');
    };
    img.onerror = () => {
      img.onerror = null;
      resolve('errorLoaded');
    };
    img.src = url;
  });
};

// 监听视频时长
function checkVideoTime(file) {
  return new Promise((resolve, reject) => {
    try {
      const fileUrl = URL.createObjectURL(file);
      const audioElement = new Audio(fileUrl);
      let duration;
      audioElement.addEventListener('loadedmetadata', () => {
        duration = audioElement.duration;
        resolve(duration);
      });
    } catch (error) {
      reject(false);
    }
  });
}

// 限制文件大小
export const beforeUpload = async (file, { accept, size, videoSize }) => {
  try {
    if (accept) {
      const reg = accept.replace('.', '').replace(/,\s?/gi, '|');
      if (!new RegExp(`.(${reg})$`).test(file.name)) {
        throwError(`只能上传以${accept}为后缀的文件`);
      }
    }
    if (videoSize) {
      if (/^video\//.test(file.type)) {
        const s = await checkVideoTime(file);
        if (s > (videoSize || 60)) {
          throwError(`上传视频时长不能超过${videoSize}S`);
        }
      }
    } else if (file.size / 1024 / 1024 > size) {
      throwError(`文件大小不能超过${size}M`);
    }
    return Promise.resolve(file);
  } catch (error) {
    message.warning(error.message);
    return Promise.reject(error.message);
  }
};
