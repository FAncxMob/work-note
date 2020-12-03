import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

import Uploader from '@/components/Uploader';

import { Form, Modal, Input, message } from 'antd';
import shop from '@/customizeModel/Shop/Shop';
import './index.less';
import config from '../../../app/config';

const { defaultImg } = config;

const TYPE = {
  getList: 'sellCategory/getList',
  delete: 'sellCategory/delete',
  update: 'sellCategory/update',
  add: 'sellCategory/add',
};

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const ClassModal = (props) => {
  const { visible, setVisible, title, initValues = {}, onOk } = props;
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const { dispatch } = props;

  useEffect(() => {
    if (visible) {
      let fileList = [];
      if (initValues.name) {
        // 编辑 没图时自动是默认图（默认分类）
        fileList = initValues.image ? [initValues.image] : [defaultImg];
      } else {
        fileList = [];
      }
      setFileList(fileList);
      form.setFieldsValue({ name: initValues.name });
    }
  }, [visible]);

  async function handleSubmit() {
    try {
      const name = form.getFieldValue('name');
      if (!checkFormValue()) return;

      const { id } = initValues;
      const shopId = await shop.getShopId();

      dispatch({
        type: id ? TYPE.update : TYPE.add,
        payload: id
          ? {
              name,
              image: fileList[0].filePath || fileList[0],
              id,
              shopId,
            }
          : [
              {
                name,
                image: fileList[0]?.filePath || defaultImg,
                shopId,
              },
            ],
        callback: () => {
          onOk();
          setVisible(false);
          message.success(`${id ? '编辑成功' : '添加成功'}`);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  function checkFormValue() {
    if (!form.getFieldValue('name')) {
      message.warning('请输入销售分类名称');
      return false;
    }
    return true;
  }

  function renderUploadImg() {
    return (
      <>
        <Uploader
          className="dib"
          drag
          onChange={(res) => {
            setFileList(res); /* res:所有文件列表； doneList：所有上传完成并且成功的文件列表 */
          }}
          fileList={fileList}
          size="1"
          limit={1}
          space="10px"
        />
      </>
    );
  }

  return (
    <Modal
      forceRender
      onOk={handleSubmit}
      onCancel={() => {
        // setFileList([]);
        setVisible(false);
      }}
      visible={visible}
      title={title}
    >
      <Form {...formItemLayout} form={form} initialValues={initValues}>
        <Form.Item name="name" label="分类名称" className="detail-rule">
          <Input
            className="ml10"
            autoFocus
            allowClear
            placeholder="请输入销售分类名称（10字以内）"
            maxLength="10"
          />
        </Form.Item>
        <Form.Item name="name" label="分类图片">
          {renderUploadImg()}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ goodsWarehouseCategory, loading }) => ({
  goodsWarehouseCategory,
  loading: loading.models.goodsWarehouseCategory,
}))(ClassModal);
