import React, { useEffect, useState } from 'react';
import CreateFormItem from '@/components/CustomerForm/createFormItem';
import Uploader from '@/components/Uploader';
import FormRules from '@/utils/FormRules';
import { imageType, videoType } from '@/utils/uploadConfig';

const FormInfo = (props) => {
  const [imagesCount, setImagesCount] = useState(0);
  const [detailImagesCount, setDDetailImagesCount] = useState(0);
  const { form } = props;

  useEffect(() => {
    const { images = [], detailImages = [] } = form.getFieldValue();
    setImagesCount(images.length);
    setDDetailImagesCount(detailImages.length);
  }, []);

  const editForm = [
    {
      el: (
        <Uploader
          drag
          limit={5}
          accept={imageType}
          onChange={(list) => {
            setImagesCount(list.length);
          }}
        />
      ),
      name: 'images',
      label: '商品图片',
      formItemOption: {
        valuePropName: 'fileList',
      },
      rule: [{ required: true, message: '请上传商品图片!' }, FormRules.checkUploadFilesStatus()],
      extra: <span>{imagesCount}/5</span>,
    },
    {
      el: (
        <Uploader
          drag
          limit={20}
          accept={imageType}
          onChange={(list) => {
            setDDetailImagesCount(list.length);
          }}
        />
      ),
      name: 'detailImages',
      label: '商品详情图',
      formItemOption: {
        valuePropName: 'fileList',
        extra: <span>{detailImagesCount}/20</span>,
      },
      rule: [FormRules.checkUploadFilesStatus()],
    },
    {
      el: <Uploader limit={1} accept={videoType} />,
      name: 'video',
      label: '视频',
      formItemOption: {
        valuePropName: 'fileList',
      },
      rule: [
        {
          validator: (rule, value) => {
            const videoImage = form.getFieldValue('videoImage');
            if (videoImage.length && !value.length)
              return Promise.reject('存在视频封面,请添加商品视频');
            return Promise.resolve();
          },
        },
        FormRules.checkUploadFilesStatus(),
      ],
    },
    {
      el: <Uploader limit={1} accept={imageType} />,
      name: 'videoImage',
      label: '视频封面',
      formItemOption: {
        valuePropName: 'fileList',
      },
      rule: [
        {
          validator: (rule, value) => {
            const video = form.getFieldValue('video');
            if (video.length && !value.length) return Promise.reject('存在商品视频,请添加视频封面');
            return Promise.resolve();
          },
        },
        FormRules.checkUploadFilesStatus(),
      ],
    },
  ];

  return <CreateFormItem FormList={editForm} />;
};

export default FormInfo;
