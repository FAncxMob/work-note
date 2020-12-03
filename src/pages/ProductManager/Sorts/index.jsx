import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Tooltip, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import moment from 'moment';

import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import DragTable from '@/components/DragTable';
import SortDialog from '../components/SortDialog';

import { columns, formList } from './utils/tableForm';
import './index';

const { confirm } = Modal;

const ACTION = {
  getList: 'sortsType/getList',
  getCommonList: 'sortsType/getCommonList',
};

const initForm = () => {
  return {
    currentPage: 1,
    pageSize: 20,
    name: '',
    status: '',
  };
};

const SortsList = (props) => {
  const [formValues, setFormValues] = useState({});

  const [list, setList] = useState({});
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form] = Form.useForm();
  const { dispatch } = props;

  const {
    location: { query },
  } = history;

  const { loading } = props;

  useEffect(() => {
    load(initForm());
  }, []);

  // 素材详情弹窗
  function handleEdit(id) {
    setVisible(true);
    setIsEdit(!id);
  }

  // 禁用分类
  async function handleDelete(id) {
    confirm({
      title: '确定禁用分类?',
      icon: <DeleteOutlined />,
      content: '分类禁用后，会影响分类使用。',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // dispatch({
        //   type: 'productModel/deleteItem',
        //   payload: id,
        //   callback: () => {
        //     load(formValues);
        //   },
        // });
      },
    });
  }

  function handleFormReset() {
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
      type: ACTION.getList,
      payload: prams,
      callback: (data) => {
        setList(data);
      },
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
    query.openStatus ? (query.openStatus = Number(query.openStatus)) : '';
    const initialValues = { ...initForm(), ...query, ...formValues };
    return (
      <CustomerForm
        FormList={formList()}
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
      />
    );
  }

  // 按钮组
  function btnGroup({ id }) {
    const size = 'middle';
    const type = 'link';
    return (
      <>
        <Tooltip title="编辑">
          <Button
            shape="circle"
            size={size}
            type={type}
            className="mr10"
            icon={<EditOutlined />}
            onClick={() => handleEdit(id)}
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

  function dragEnd(val) {
    list.list = val;
    const obj = { ...list };
    setList(obj);
  }

  return (
    <PageHeaderWrapper>
      <Card title={<RenderForm />}>
        <div className="mb10">
          <Button type="primary" onClick={() => handleEdit()}>
            添加分类
          </Button>
        </div>
        <CustomerTable
          rowKey="id"
          loading={loading}
          data={list}
          columns={columns(btnGroup)}
          param={formValues}
          scroll={{ x: 1000 }}
          onTableChange={(res) => {
            tableChange(res);
          }}
          size="small"
        />
        {/* <DragTable
          rowKey="id"
          dataSource={list.list || []}
          columns={columns(btnGroup)}
          size="small"
          dragEnd={(val) => {
            dragEnd(val);
          }}
          scroll={{ x: 1000 }}
        /> */}
      </Card>
      <SortDialog visible={visible} isEdit={isEdit} setVisible={setVisible} />
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, sortsType }) => ({
  sortsType,
  loading: loading.effects[ACTION.getList],
}))(SortsList);
