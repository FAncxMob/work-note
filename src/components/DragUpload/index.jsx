import React, { memo } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import UploadList from 'antd/lib/upload/UploadList';
import { Modal, Upload } from 'antd';
import { beforeUpload } from '@/utils/beforeUpload';
import arrayMove from '@/utils/arrayMove';

import './pictureGrid.less';

const itemStyle = {
  width: 104,
  height: 104,
  margin: 4,
  marginLeft: 0,
  cursor: 'grab',
};
const SortableItem = SortableElement((params) => (
  <div style={itemStyle}>
    <UploadList
      locale={{ previewFile: '预览图片', removeFile: '删除图片' }}
      showDownloadIcon={false}
      listType={params.props.listType}
      onRemove={params.props.useRemove ? params.onRemove : null}
      items={[params.item]}
      onPreview={params.props.onPreview || null}
    />
  </div>
));

const listStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  maxWidth: '100%',
};
const SortableList = SortableContainer((params) => {
  return (
    <div style={listStyle}>
      {params.items.map((item, index) => (
        <SortableItem
          key={`${item.uid}`}
          index={index}
          item={item}
          props={params.props}
          onRemove={params.onRemove}
        />
      ))}
      <Upload
        {...params.props}
        className="drag_upload"
        beforeUpload={(file) => beforeUpload(file, params.props.beforeUpload)}
        showUploadList={false}
        onChange={params.onChange}
      >
        {params.props.children}
      </Upload>
    </div>
  );
});

function asyncModal() {
  const { confirm } = Modal;

  return new Promise((res, rej) => {
    confirm({
      title: '确认要移除图片吗',
      content: '移除图片后，记得要点击保存按钮哦',
      onCancel: () => {
        res(false);
      },
      onOk: () => {
        res(true);
      },
    });
  });
}

const PicturesGrid = memo(({ onChange: onFileChange, ...props }) => {
  const fileList = props.fileList || [];
  const onSortEnd = ({ oldIndex, newIndex }) => {
    onFileChange({ fileList: arrayMove(fileList, oldIndex, newIndex) });
  };

  const onChange = ({ fileList: newFileList }) => {
    console.log('onChange', newFileList);
    if (onFileChange) onFileChange({ fileList: newFileList });
  };

  const onRemove = async (file) => {
    const res = await asyncModal();
    if (res) {
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      if (props.onRemove && props.onRemove(file)) {
        onFileChange({ fileList: newFileList });
      }
    } else {
      return Promise.reject('已取消');
    }
  };
  return (
    <>
      <SortableList
        // 当移动 1 之后再触发排序事件，默认是0，会导致无法触发图片的预览和删除事件
        props={props}
        items={fileList}
        onSortEnd={onSortEnd}
        axis="xy"
        helperClass="SortableHelper"
        distance={1}
        onChange={onChange}
        onRemove={onRemove}
      />
    </>
  );
});

export default PicturesGrid;
