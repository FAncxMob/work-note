import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Upload, Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import superagent from 'superagent';

import { signHeader } from '@/utils/sign';
import config from '@/utils/config';
import arrayMove from '@/utils/arrayMove';
import UFF from '@/utils/UFF';
import { sleep, mul } from '@/utils/utils';

import {
  ThemeContext,
  SortableList,
  Item,
  transferImgUrl,
  loadedImage,
  beforeUpload,
} from './fn.js';
import styles from './index.less';

const ANTD_PROPS = {
  multiple: true,
  action: config.uploadUrl,
};

// 默认参数
const DEFAULT_PROPS = {
  multiple: true,
  action: config.uploadUrl,
  size: 5,
  videoSize: 60,
  accept: '',
  isVertical: false,
  width: '120px',
  height: '120px',
  space: '10px',
  describe: '',
};

/**
 *
 * @param {string} mode ['push'] 限制上传模式，默认 push：按钮和图片分开，上传的图片直接添加到fileList里面去；replace：直接替换button， 且只能有一张
 * @param {string | number} size [5] 以M为单位，限制图片文件（除视频）大小,默认5M
 * @param {string | number} videoSize [60] 以S为单位，限制视频大小,默认60s
 * @param {string | number} limit  限制个数，默认不限
 * @param {Boolean} drag [false] 是否可以拖拽,默认不可以
 * @param {string} accept [''] 接收图片类型, 默认所有 ".png,.jpg,.mp4"等等
 * @param {string} multiple [true] 选择图片对否可多选, 默认多选  true false
 * @param {string} isVertical [false] 图片是否竖向排列, 默认false,可选：true， false
 * @param {string} width ['120px'] 图片宽度, 可选
 * @param {string} height ['120px'] 图片高度, 可选
 * @param {string} space ['10px'] 图片间距, 直接加到图片上margin: space
 * @param {Node}   describe [<div>描述</div>] 图片底下的描述，直接传node
 *
 */
function Uploader({ fileList: sourceFileList = [], onChange: setSource, children, ...restProps }) {
  try {
    if (sourceFileList === undefined) throw Error(`缺少关键参数：fileList`);
    if (setSource === undefined) throw Error(`缺少关键参数：onChange`);
  } catch (error) {
    console.error(error);
  }

  const uploadRef = useRef();
  const [previewFileList, setPreviewFileList] = useState([]);
  const [previewFile, setPreviewFile] = useState({});
  const [visible, setVisible] = useState(false);

  const allProps = {
    ...ANTD_PROPS,
    ...DEFAULT_PROPS,
    ...restProps,
  };
  // 单张替换
  if (allProps.mode === 'replace') {
    allProps.multiple = false;
    allProps.limit = 1;
    allProps.drag = false;
  }
  const {
    isVertical,
    size,
    videoSize,
    accept,
    width,
    height,
    space,
    describe,
    limit,
    mode,
    drag,
  } = allProps;

  // #region useEffect

  useEffect(() => {
    // if (previewFileList.length === 0) {

    const arr = sourceFileList.map((v, i) => {
      if (typeof v === 'string') {
        return { filePath: v, transferUrl: transferImgUrl(v, width !== height), id: String(i) };
      }
      v.transferUrl = transferImgUrl(v.filePath, width !== height);
      return v;
    });
    setPreviewFileList(arr);
    // }
  }, [sourceFileList]);
  // #endregion

  // #region handle

  // 修改source
  const changePreSource = (list) => {
    setPreviewFileList(list);
    setSource(
      [...list],
      list.filter((v) => !v.status || v.status === 'done'),
    );
  };

  const transferFile = (type, obj) => {
    // loaded  errorLoaded
    const index = previewFileList.findIndex((v) => v.id === obj.id);
    if (type === 'loaded') delete obj.status;
    else if (type === 'errorLoaded') obj.status = 'error';
    if (index > -1) {
      previewFileList[index] = obj;
    } else if (mode === 'replace') {
      previewFileList[0] = obj;
    } else if (!limit || previewFileList.length < Number(limit)) {
      previewFileList.push(obj);
    }
    changePreSource(previewFileList);
  };
  const handleChange = async (info) => {
    const {
      file,
      // fileList,
      file: { status, uid, name, percent, id },
    } = info;
    const key = uid || id;
    file.response = file.response ? file.response : {};
    const reallyStatus = status === 'done' && !file.response.data ? 'error' : status; // 请求失败的时候status是done 但是data没值
    const obj =
      reallyStatus === 'done'
        ? { ...file.response.data, name, id: key, percent, status: reallyStatus }
        : { status: reallyStatus, id: key, name, percent: Math.floor(mul(percent, 100)) / 100 };

    if (reallyStatus === 'done') {
      const { filePath } = file.response.data;
      obj.transferUrl = transferImgUrl(filePath, width !== height);
      const type = await loadedImage(obj.transferUrl);
      transferFile(type, obj);
    } else {
      transferFile(null, obj);
    }
  };

  // 限制文件大小
  const onBeforeUpload = (file) => {
    return beforeUpload(file, { accept, size, videoSize });
  };

  const handlePreview = async (e) => {
    const { filePath } = e.currentTarget.dataset;
    if (!filePath) return;

    const isVideo = /td-videos/.test(filePath); // 视频
    const url = isVideo ? UFF.getVideoUrl(filePath) : UFF.getSkuPDImage(filePath);
    setPreviewFile({
      url,
      title: filePath.substring(filePath.lastIndexOf('/') + 1),
      type: isVideo ? 'video' : 'image',
    });
    setVisible(true);
  };

  const handleDelete = (e) => {
    const { id } = e.currentTarget.dataset;
    const index = previewFileList.findIndex((v) => v.id === id);
    if (index > -1) {
      previewFileList.splice(index, 1);
      changePreSource(previewFileList);
    }
  };

  const handleUpload = (e) => {
    try {
      uploadRef.current.upload.uploader.fileInput.click();
    } catch (error) {
      // console.log(error)
    }
  };

  const handlePreviewCancel = async () => {
    setVisible(false);
    await sleep(100);
    setPreviewFile({});
  };

  // #endregion

  // #region render

  function renderDragPreviewArea(fileList) {
    const onSortEnd = ({ oldIndex, newIndex }) => {
      const arr = arrayMove(fileList, oldIndex, newIndex);
      changePreSource(arr);
    };

    return (
      <SortableList
        distance={1}
        items={fileList}
        axis="xy"
        helperClass="SortableHelper"
        fileList={fileList}
        isVertical={isVertical}
        onSortEnd={onSortEnd}
      />
    );
  }

  function renderFixedPreviewArea(fileList) {
    return fileList.map((item) => Item(item, ThemeContext));
  }

  // #endregion

  const renderPreviewArea = drag ? renderDragPreviewArea : renderFixedPreviewArea;
  const propsValue = {
    ...allProps,
    onPreview: handlePreview,
    onDelete: handleDelete,
    onUpload: handleUpload,
  };
  const antdNeedProps = {};

  Object.keys(ANTD_PROPS).forEach((v) => {
    antdNeedProps[v] = allProps[v];
  });

  function customRequest(options) {
    const { action, filename, onSuccess, onError, file, onProgress } = options;

    const formData = new FormData();
    formData.append(filename, file);

    superagent
      .post(action)
      .set(signHeader())
      .send(formData)
      .on('progress', (event) => {
        const { percent } = event;
        onProgress({ percent: percent.toFixed(2) });
      })
      .then(
        (res) => {
          onSuccess(res.body);
        },
        (err) => {
          onError(err);
        },
      );
  }

  return (
    <ThemeContext.Provider value={propsValue}>
      <div
        className={[
          styles['uploader-preview-wrap'],
          isVertical ? 'df align-start flex-column' : '',
        ].join(' ')}
      >
        {renderPreviewArea(previewFileList)}
        <div
          style={{
            verticalAlign: 'middle',
            display:
              !!limit && previewFileList.length >= Number(limit) && mode !== 'replace'
                ? 'none'
                : 'inline-block',
            width,
            height,
            margin: space,
          }}
        >
          <Upload.Dragger
            ref={uploadRef}
            {...antdNeedProps}
            customRequest={customRequest}
            headers={signHeader()}
            showUploadList={false}
            className={[isVertical ? '' : 'dib vertical-middle dib']}
            beforeUpload={size || accept || videoSize ? onBeforeUpload : true}
            onChange={handleChange}
          >
            {children || (
              <div>
                <p>
                  <InboxOutlined className="text-primary iz48" />
                </p>
                <p>
                  点击或拖拽文件
                  <br />
                  到此区域上传
                </p>
              </div>
            )}
          </Upload.Dragger>
        </div>
        {describe}
        <Modal
          visible={visible}
          title={previewFile.title}
          centered
          footer={null}
          onCancel={handlePreviewCancel}
        >
          {previewFile.type === 'video' ? (
            <video controls autoPlay className="w100p vertical-middle fz0">
              <source src={previewFile.url} />
              <track kind="captions" />
              <p>您的浏览器不支持HTML5视频播放功能</p>
            </video>
          ) : (
            <img alt="example" className="w100p" src={previewFile.url} />
          )}
        </Modal>
      </div>
    </ThemeContext.Provider>
  );
}

export default Uploader;
