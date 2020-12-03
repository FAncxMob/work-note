import React, { useState } from 'react';
import { Tag, Form } from 'antd';
import Uploader from '@/components/Uploader';
import { imageType } from '@/utils/uploadConfig';
import FormRules from '@/utils/FormRules';
import SkuLabelModal from './skuLabelModal';
import styles from './index.less';

const SkuItemEdit = (props) => {
  const [labelForm, setLabelForm] = useState({ visible: false, skuLabel: '' });

  const { max = 9, onChange = () => {}, value: skuLabelList = [], withImage = true } = props;

  // 新增商品规格项目
  function handleAddSkuLabel({ skuLabel }) {
    const { changeIndex } = labelForm;

    if (skuLabelList.some((item) => item.name === skuLabel)) {
      setLabelForm({ visible: false, skuLabel: '' });
      return;
    }
    let changeList = [];
    if (changeIndex) {
      skuLabelList[changeIndex].name = skuLabel;
      changeList = [...skuLabelList];
    } else {
      changeList = [...skuLabelList, { name: skuLabel, image: [] }];
    }
    setLabelForm({ visible: false, skuLabel: '' });
    onChange(changeList);
  }

  function renderAddSkuLabelBtn() {
    if (skuLabelList.length >= max) return null;
    return (
      <a
        className="mb10 ml10 "
        style={{ whiteSpace: 'nowrap' }}
        onClick={() => {
          setLabelForm({ visible: true, skuLabel: '' });
        }}
      >
        +添加规格
      </a>
    );
  }

  // 删除商品规格项目
  function handleDeleteSkuLabel(index) {
    skuLabelList.splice(index, 1);
    const changeList = [...skuLabelList];
    onChange(changeList);
  }

  function setSkuImage(index, imageFiles) {
    skuLabelList[index].image = imageFiles;
    onChange([...skuLabelList]);
  }

  return (
    <div className="df flex-wrap align-center">
      {skuLabelList.map((item, index) => {
        const key = `skuItem-${index}`;
        return (
          <div className="dib" key={index}>
            <div className={`ml10 ${withImage ? styles.tagWrapper : ''}`}>
              <Tag
                className="text-ellipsis"
                title={item.name}
                key={key}
                color="blue"
                closable
                visible
                onClick={() => {
                  setLabelForm({ visible: true, skuLabel: item, changeIndex: String(index) });
                }}
                onClose={() => {
                  handleDeleteSkuLabel(index);
                }}
              >
                {item.name}
              </Tag>
            </div>
            {withImage ? (
              <Uploader
                fileList={item.image}
                onChange={(images) => {
                  setSkuImage(index, images);
                }}
                accept={imageType}
                limit={1}
              />
            ) : null}
          </div>
        );
      })}
      {renderAddSkuLabelBtn()}
      <SkuLabelModal
        visible={labelForm.visible}
        skuLabel={labelForm.skuLabel.name}
        onCancel={() => {
          setLabelForm({ visible: false, skuLabel: '' });
        }}
        onOk={(res) => {
          handleAddSkuLabel(res);
        }}
      />
    </div>
  );
};

export default SkuItemEdit;
