import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Tooltip, message, Modal, TreeSelect } from 'antd';
import { EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
// import moment from 'moment';

import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/index_.jsx';

import { initForm } from '../utils';
import { formList } from './formList';
import { columns } from './columns';
import '../detail/index.less';

const { confirm } = Modal;

const ProductList = (props) => {
  const [formValues, setFormValues] = useState({});
  // const [searchTree, setSearchTree] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const { dispatch } = props;

  const {
    location: { query },
  } = history;

  const {
    loading,
    productModel: { cityTree, categoryTree, categorySearchData, list },
  } = props;

  useEffect(() => {
    if (categoryTree.length < 1) {
      // handleCategoryOnLoadData();
    }
    if (cityTree.length < 1) {
      // handleCityOnLoadData();
    }
  }, []);

  // 按钮组
  function btnGroup({ id, shelveStatus, auditStatus }) {
    // 0-未上架，1-上架申请中，2-已上架，3-已下架 shelveStatus
    // 0-未审核，1-待审核，2-审核成功，3-审核失败 auditStatus
    const size = 'middle';
    const type = 'link';
    if (auditStatus === 1 || shelveStatus === 1) {
      return (
        <Tooltip title="编辑商品">
          <Button
            shape="circle"
            size={size}
            type={type}
            icon={<EditOutlined />}
            onClick={() => handleEdit(id)}
          />
        </Tooltip>
      );
    }
    if (shelveStatus === 0 || shelveStatus === 3) {
      return (
        <>
          <Tooltip title="编辑商品">
            <Button
              shape="circle"
              size={size}
              type={type}
              className="mr10"
              icon={<EditOutlined />}
              onClick={() => handleEdit(id)}
            />
          </Tooltip>

          <Tooltip title="申请上架商品">
            <Button
              shape="circle"
              size={size}
              type={type}
              icon={<UploadOutlined />}
              onClick={() => handleUp(id)}
            />
          </Tooltip>

          <Tooltip title="删除">
            <Button
              shape="circle"
              size={size}
              type={type}
              className="mr10"
              icon={<DeleteOutlined className="text-red" />}
              onClick={() => handleDelete(id)}
            />
          </Tooltip>
        </>
      );
    }
    if (shelveStatus === 2) {
      return (
        <>
          <Tooltip title="编辑商品">
            <Button
              shape="circle"
              size={size}
              type={type}
              className="mr10"
              icon={<EditOutlined />}
              onClick={() => handleEdit(id)}
            />
          </Tooltip>

          <Tooltip title="下架商品">
            <Button
              shape="circle"
              size={size}
              type={type}
              icon={<DownloadOutlined className="text-red" />}
              onClick={() => handleDown(id)}
            />
          </Tooltip>
        </>
      );
    }
    return null;
  }
  // 跳转商品详情页
  function handleEdit(id) {
    history.push({
      pathname: '/productManager/product/list/detail',
      query: { id },
    });
  }

  // 删除
  async function handleDelete(id) {
    confirm({
      title: '确定删除商品?',
      icon: <DeleteOutlined />,
      content: '商品删除后，会影响用户正常浏览',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'productModel/deleteItem',
          payload: id,
          callback: () => {
            load(formValues);
          },
        });
      },
    });
  }

  // 申请上架
  function handleUp(id) {
    let keys = [];
    if (id === undefined) {
      if (selectedRowKeys.length < 1) {
        message.warning('请先批量选中数据');
        return;
      }
      keys = selectedRowKeys.map((item) => item.id);
    } else {
      keys = [id];
    }
    dispatch({
      type: 'productModel/applyUp',
      payload: keys,
      callback: () => {
        message.success('已申请上架，请耐心等待');
      },
    });
  }

  // 下架
  function handleDown(id) {
    confirm({
      title: '确定下架商品?',
      icon: <DeleteOutlined />,
      content: '商品下架后，会影响正常浏览，可重新上架',
      onOk() {
        dispatch({
          type: 'productModel/getDown',
          payload: id,
          callback: () => {},
        });
      },
    });
  }
  // treeSelect 选择状态改变时
  function treeSelectChange(e, name) {
    // searchTree[name] = [e];
    formValues[name] = e;
    setFormValues({ ...formValues });
    // setSearchTree(searchTree);
  }
  // 获取商品分类
  function handleCategoryOnLoadData() {
    dispatch({
      type: 'productModel/categoryOnLoadData',
      payload: { ...categorySearchData },
    });
  }

  // 获取服务城市
  function handleCityOnLoadData() {
    dispatch({
      type: 'productModel/cityOnLoadData',
      payload: { province: '' },
    });
  }

  function handleFormReset() {
    // form.resetFields();
    form.setFieldsValue(initForm());
    setFormValues(initForm());
  }

  function handleSearch() {
    form.validateFields().then((res) => {
      res.categoryIds = formValues.categoryIds;
      const data = { ...initForm(), ...res };
      setFormValues(data);
    });
  }
  // 加载获取列表数据
  function load(_data) {
    const { categoryIds, serviceCities } = _data;
    const prams = { ...query, ..._data };
    prams.categoryIds = categoryIds ? [categoryIds] : [];
    prams.serviceCities = serviceCities ? [serviceCities] : [];
    dispatch({
      type: 'productModel/getList',
      payload: prams,
    });
  }
  // table分页切换时回调
  async function tableChange(pagination) {
    const { pageSizeOptions, current, total, currentPage, pageSize, ...rest } = pagination;
    const params = {
      ...formValues,
      currentPage: currentPage || current,
      pageSize,
      ...rest,
    };
    await setFormValues(params);
    load(params);
  }

  function RenderForm() {
    query.auditStatus ? (query.auditStatus = Number(query.auditStatus)) : '';
    query.deliveryType ? (query.deliveryType = Number(query.deliveryType)) : '';
    query.shelveStatus ? (query.shelveStatus = Number(query.shelveStatus)) : '';
    const initialValues = { ...initForm(), ...query, ...formValues };
    return (
      <CustomerForm
        FormList={formList(cityTree)}
        layout="inline"
        initialValues={initialValues}
        hideButton
        form={form}
        extra={
          <Form.Item>
            <Button onClick={handleFormReset}>重置</Button>
            <Button type="primary" className="ml10" onClick={handleSearch}>
              查询
            </Button>
          </Form.Item>
        }
      >
        {/* <Form.Item label="商品分类">
          <TreeSelect
            allowClear
            value={formValues.categoryIds || undefined}
            className="min-w195"
            onChange={(e) => {
              treeSelectChange(e, 'categoryIds');
            }}
            treeData={categoryTree}
            placeholder="请选择商品分类"
          />
        </Form.Item> */}
      </CustomerForm>
    );
  }
  const getProStatus = (val) => {
    if (val.auditStatus === 1 || val.auditStatus === 2) return true;
    if (val.shelveStatus === 1 || val.shelveStatus === 2) return true;
    return false;
  };
  const rowSelection = {
    onChange: (keys, rows) => {
      setSelectedRowKeys(rows);
    },
    getCheckboxProps: (record) => ({
      disabled: getProStatus(record),
      name: record.id,
    }),
  };
  //
  return (
    <PageHeaderWrapper>
      <Card title={<RenderForm />}>
        <div className="mb10">
          {list.list && list.list.length > 0 ? (
            <Tooltip title="批量申请上架">
              <Button type="primary" onClick={() => handleUp()}>
                批量操作
              </Button>
            </Tooltip>
          ) : null}
          <Button type="primary" className="ml10" onClick={() => handleEdit()}>
            添加商品
          </Button>
        </div>
        <CustomerTable
          rowKey="id"
          loading={loading}
          rowRadioSelection={{ ...rowSelection, type: 'checkbox' }}
          data={list}
          columns={columns(btnGroup)}
          param={formValues}
          scroll={{ x: 1000 }}
          onTableChange={(res) => {
            tableChange(res);
          }}
          size="small"
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, productModel }) => ({
  productModel,
  loading: loading.models.productModel,
}))(ProductList);
