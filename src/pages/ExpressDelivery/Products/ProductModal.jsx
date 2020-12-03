import React, { useEffect } from 'react';
import { Modal, Table, Form, Input, InputNumber } from 'antd';
import UFF from '@/utils/UFF';
import FormRules from '@/utils/FormRules';
import Uploader from '@/components/Uploader';
import { imageType } from '@/utils/uploadConfig';

const { Item } = Form;

const needFormat = ['limit', 'stock'];

const ProductModal = (props) => {
  const { visible, onSubmit, onClose, data = {}, type = 'edit' } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) form.resetFields();
  }, [visible]);

  function handleSubmit() {
    form.validateFields().then(async ({ adImages, ...rest }) => {
      const skus = [];
      adImages = adImages.map((item) => item.filePath);
      Object.entries(rest).forEach(([key, value]) => {
        const [index, name] = key.split('-');
        if (needFormat.indexOf(name) > -1 && value === '') value = -1;
        skus[Number(index)] = skus[Number(index)]
          ? { ...skus[Number(index)], [name]: value }
          : {
              [name]: value,
            };
      });
      await onSubmit(skus, adImages);
      onClose();
    });
  }

  function itemRender(name, defaultValue, index, el, rule) {
    return (
      <Item name={`${index}-${name}`} initialValue={defaultValue} rules={rule} className="mb0">
        {el}
      </Item>
    );
  }

  const columns = [
    {
      key: 'adImages',
      title: '广告图',
      width: 200,
      align: 'center',
      dataIndex: 'adImages',
      render: (value, row, index) => {
        const children = (
          <Item
            name="adImages"
            valuePropName="fileList"
            initialValue={data.adImages || []}
            rules={[FormRules.checkUploadFilesStatus()]}
          >
            <Uploader accept={imageType} limit={1} />
          </Item>
        );
        const obj = {
          children,
          props: {},
        };
        if (index === 0) obj.props.rowSpan = data.skus.length;
        if (index > 0) obj.props.rowSpan = 0;
        return obj;
      },
    },
    {
      key: 'image',
      title: '规格主图',
      width: 80,
      align: 'center',
      dataIndex: 'image',
      render: (val, { index }) =>
        itemRender(
          'image',
          val,
          index,
          <img className="w40 h40 bdr5" src={UFF.getProductImage(val)} alt="" />,
        ),
    },
    {
      key: 'name',
      title: '规格',
      ellipsis: true,
      className: `${data.skuAttrs && data.skuAttrs.length ? '' : 'dn'}`,
      dataIndex: 'name',
      render: (val, { index }) => itemRender('name', val || [], index, <span>{val}</span>),
    },
    {
      key: 'marketPrice',
      title: '划线价',
      align: 'center',
      dataIndex: 'marketPrice',
      render: (val, { index }) =>
        itemRender(
          'marketPrice',
          val,
          index,
          <Input className="text-center" placeholder="请输入划线价" />,
          [{ required: 'true', message: '请输入划线价' }, FormRules.priceValidator('划线价')],
        ),
    },
    {
      key: 'sales',
      title: '零售价',
      align: 'center',
      dataIndex: 'sales',
      render: (val, { index }) =>
        itemRender(
          'sales',
          val,
          index,
          <Input className="text-center" placeholder="请输入零售价" />,
          [{ required: 'true', message: '请输入零售价' }, FormRules.priceValidator('零售价')],
        ),
    },
    {
      key: 'stock',
      title: '库存',
      align: 'center',
      dataIndex: 'stock',
      render: (val, { index }) =>
        itemRender(
          'stock',
          val === -1 ? '' : val,
          index,
          <Input className="text-center" placeholder="不限" />,
          [FormRules.integerValidator('库存')],
        ),
    },
    {
      key: 'limit',
      title: '限购',
      align: 'center',
      dataIndex: 'limit',
      render: (val, { index }) =>
        itemRender(
          'limit',
          val === -1 ? '' : val,
          index,
          <Input className="text-center" placeholder="不限" />,
          [FormRules.integerValidator('限购')],
        ),
    },
    {
      key: 'baseSaleCount',
      title: '基础销量',
      align: 'center',
      dataIndex: 'baseSaleCount',
      render: (val, { index }) =>
        itemRender(
          'baseSaleCount',
          val,
          index,
          <Input className="text-center" placeholder="请输入基础销量" />,
          [FormRules.integerValidator('基础销量')],
        ),
    },
    {
      key: 'commissionPercent',
      title: '佣金比例',
      align: 'center',
      dataIndex: 'commissionPercent',
      render: (val, { index }) =>
        itemRender(
          'commissionPercent',
          val || 0,
          index,
          <InputNumber
            className="text-center"
            placeholder="0"
            max={100}
            min={0}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
          />,
          [FormRules.priceValidator('佣金比例', 100)],
        ),
    },
    {
      key: 'id',
      align: 'center',
      className: 'dn',
      dataIndex: 'id',
      render: (val, { index }) => (
        <Item name={`${index}-${type === 'edit' ? 'id' : 'baseSkuId'}`} initialValue={val}>
          <span>{val}</span>
        </Item>
      ),
    },
  ];
  return (
    <Modal
      destroyOnClose
      width={1100}
      visible={visible}
      title="添加商品"
      onOk={handleSubmit}
      onCancel={() => onClose()}
      maskClosable={false}
    >
      <Form form={form}>
        <Table
          rowKey="id"
          bordered
          dataSource={data.skus && data.skus.map((item, index) => ({ ...item, index }))}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Form>
    </Modal>
  );
};

export default ProductModal;
