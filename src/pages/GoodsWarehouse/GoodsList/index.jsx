import React, { useState } from 'react';
import { history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import { Card, Form, Button, Popconfirm, Radio, Switch, Image, Tag, message } from 'antd';
import routeMap from '@/routeMap';
import UFF from '@/utils/UFF';
import { formatPrice } from '@/utils/format';

const DEFAULT_VALUE = {
  name: '',
  saleStatus: '',
};

const DELIVERY_TYPE = {
  pickupAndExpress: '全部',
  pickup: '自提',
  express: '配送',
};

const STATUS = [
  {
    text: '全部',
    value: '',
  },
  {
    text: '启售',
    value: '1',
  },
  {
    text: '禁售',
    value: '0',
  },
];

const ACTION = {
  getList: 'warehouseGoodsList/getList',
  delete: 'warehouseGoodsList/delete',
  changeStatus: 'warehouseGoodsList/changeStatus',
  getTypeList: 'warehouseGoodsList/getTypeList',
};

const GoodsList = (props) => {
  const [formValues, setFormValues] = useState({});
  const [initialValues, setInitValues] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [form] = Form.useForm();
  const { dispatch } = props;
  const {
    location: { query = {} },
  } = history;

  const {
    warehouseGoodsList: { listData, typeList },
    loading,
  } = props;

  const columns = [
    {
      key: 'id',
      title: '商品id',
      dataIndex: 'id',
      align: 'center',
      width: 100,
    },
    {
      title: '商品主图',
      dataIndex: 'image',
      align: 'center',
      width: 100,
      render: (val) => <Image width={100} src={UFF.getGroupListImage(val)} />,
    },
    {
      title: '商品名称',
      align: 'left',
      width: 200,
      render: (record) =>
        record.skuAttrs.length > 0 ? (
          <>
            <Tag color="blue">多规格</Tag>
            {record.name}
          </>
        ) : (
          record.name
        ),
    },
    {
      title: '零售价',
      align: 'left',
      width: 100,
      dataIndex: 'minSales',
      render: (val) => formatPrice(val),
    },
    {
      title: '划线价',
      align: 'left',
      width: 100,
      dataIndex: 'minMarketPrice',
      render: (val) => formatPrice(val),
    },
    {
      title: '配送方式',
      align: 'center',
      width: 50,
      dataIndex: 'deliveryType',
      render: (val) => DELIVERY_TYPE[val],
    },
    {
      title: '销售状态',
      align: 'center',
      width: 50,
      render: ({ id, saleStatus }) => {
        const enabled = String(saleStatus) === '1';
        return (
          <Popconfirm
            title={`是否${enabled ? '禁售' : '启售'}该商品?`}
            onConfirm={() => handleChangeStatus(!enabled, id)}
          >
            <Switch checkedChildren="启售" unCheckedChildren="禁售" checked={enabled} />
          </Popconfirm>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render: ({ id, saleStatus }) => {
        const disabledDelete = String(saleStatus) === '1';

        return (
          <>
            <Button
              type="link"
              onClick={() => history.push(`${routeMap.goodsWarehouseEditGoods}?id=${id}`)}
            >
              编辑
            </Button>
            <Popconfirm
              title="是否删除该商品?"
              disabled={disabledDelete}
              onConfirm={() => handleDelete(id)}
            >
              <Button type="link" disabled={disabledDelete}>
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const load = () => {
    const { saleStatus = '', categoryId = '', name = '' } = query;
    setInitValues({
      saleStatus,
      categoryId,
      name,
    });

    dispatch({
      type: ACTION.getList,
      payload: query,
    });

    getTypeList();

    setLoaded(true);
  };

  function getTypeList() {
    dispatch({
      type: ACTION.getTypeList,
    });
  }

  function handleChangeStatus(enable, id) {
    dispatch({
      type: ACTION.changeStatus,
      payload: {
        productId: id,
        enable,
      },
    });
  }

  function handleDelete(id) {
    dispatch({
      type: ACTION.delete,
      payload: { productId: id },
      callback: () => {
        load();
        message.success('删除商品成功');
      },
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
        name: 'name',
        type: 'input',
        elOptions: {
          placeholder: '输入商品名称',
          allowClear: true,
          onPressEnter: () => {
            handleSearch();
          },
        },
      },
      {
        type: 'select',
        name: 'categoryId',
        label: '分类',
        optionData: typeList,
        elOptions: {
          className: 'min-w195',
          onChange: () => {
            handleSearch();
          },
        },
      },
      {
        name: 'saleStatus',
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
        extra={
          <Form.Item>
            <Button
              type="primary"
              onClick={() => {
                handleSearch();
              }}
            >
              查询
            </Button>
            <Button
              className="ml10"
              onClick={() => {
                restForm(DEFAULT_VALUE);
              }}
            >
              重置
            </Button>
          </Form.Item>
        }
      />
    );
  };
  return (
    <PageHeaderWrapper title="商品库列表">
      <Card
        title={RenderForm()}
        extra={
          <Button
            type="primary"
            onClick={() => {
              history.push(routeMap.goodsWarehouseAddGoods);
            }}
          >
            新增商品
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

export default connect(({ loading, warehouseGoodsList }) => ({
  warehouseGoodsList,
  loading: loading.effects[ACTION.getList],
}))(GoodsList);
