import React, { useState } from 'react';
import { history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import { Card, Form, Button, Popconfirm, Radio, Switch } from 'antd';
import routeMap from '@/routeMap';

const STATUS = [
  {
    text: '全部',
    value: '',
  },
  {
    text: '启用',
    value: '1',
  },
  {
    text: '禁用',
    value: '0',
  },
];

const ACTION = {
  getList: 'pickupListModel/getList',
  delete: 'pickupListModel/delete',
  changeStatus: 'pickupListModel/changeStatus',
};

const PickList = (props) => {
  const [formValues, setFormValues] = useState({});
  const [initialValues, setInitValues] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [form] = Form.useForm();
  const { dispatch } = props;
  const {
    location: { query = {} },
  } = history;

  const {
    pickupListModel: { listData },
    loading,
  } = props;

  const columns = [
    {
      key: 'id',
      title: '自提点名称',
      dataIndex: 'name',
      align: 'left',
      width: 100,
    },
    {
      title: '联系人',
      align: 'left',
      width: 50,
      render: ({ contactName, contactMobile }) => (
        <div>
          <div>姓名：{contactName}</div>
          <div>电话：{contactMobile}</div>
        </div>
      ),
    },
    {
      title: '详细地址',
      align: 'left',
      width: 200,
      render: ({ province, city, area, communityAddress, detail }) =>
        province + city + area + communityAddress + detail,
    },
    {
      title: '状态',
      align: 'center',
      width: 50,
      render: ({ id, isEnabled }) => {
        const enabled = String(isEnabled) === '1';
        return (
          <Popconfirm
            title={`是否${enabled ? '禁用' : '启用'}该自提点?`}
            onConfirm={() => handleChangeStatus(!enabled, id)}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={enabled} />
          </Popconfirm>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 60,
      render: ({ id }) => {
        return (
          <>
            <Button type="link" onClick={() => history.push(`${routeMap.pickupEdit}?id=${id}`)}>
              编辑
            </Button>
            <Popconfirm title="是否删除该自提点?" onConfirm={() => handleDelete(id)}>
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const load = () => {
    const { isEnabled = '' } = query;
    setInitValues({
      isEnabled,
    });

    dispatch({
      type: ACTION.getList,
      payload: query,
    });

    setLoaded(true);
  };

  function handleChangeStatus(status, id) {
    dispatch({
      type: ACTION.changeStatus,
      payload: {
        id,
        enable: Number(status),
      },
    });
  }

  function handleDelete(id) {
    dispatch({
      type: ACTION.delete,
      payload: { id },
      callback: () => load(),
    });
  }

  const handleStandardTableChange = (pagination) => {
    const { pageSizeOptions, current, total, currentPage, pageSize, ...rest } = pagination;
    const params = {
      currentPage: currentPage || current,
      pageSize,
      ...rest,
    };
    setFormValues(params);
    load();
  };

  const handleSearch = () => {
    form.validateFields().then((res) => {
      restForm(res);
    });
  };

  function restForm(param) {
    setFormValues({ ...formValues, ...param });
  }

  const RenderForm = () => {
    if (!loaded) return null;

    const FormList = [
      {
        name: 'isEnabled',
        el: (
          <Radio.Group
            buttonStyle="solid"
            onChange={() => {
              handleSearch();
            }}
          >
            {STATUS.map((v) => (
              <Radio.Button key={v.value} value={v.value}>
                {v.text}
              </Radio.Button>
            ))}
          </Radio.Group>
        ),
      },
    ];

    return (
      <CustomerForm
        FormList={FormList}
        layout="inline"
        hideButton
        form={form}
        initialValues={initialValues}
        // extra={
        //   <Form.Item>
        //     <Button type="primary" className="ml10" onClick={()=>{handleSearch()}}>
        //       查询
        //     </Button>
        //   </Form.Item>
        // }
      />
    );
  };
  return (
    <PageHeaderWrapper title="自提点列表">
      <Card
        title={RenderForm()}
        extra={
          <Button
            type="primary"
            onClick={() => {
              history.push(routeMap.pickupAdd);
            }}
          >
            新增
          </Button>
        }
      >
        <CustomerTable
          rowKey="id"
          loading={loading}
          data={listData}
          columns={columns}
          onTableChange={handleStandardTableChange}
          param={formValues}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, pickupListModel }) => ({
  pickupListModel,
  loading: loading.effects[ACTION.getList],
}))(PickList);
