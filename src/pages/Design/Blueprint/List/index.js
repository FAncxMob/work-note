import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { Card, Button, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

import ROUTE_MAP from '@/routeMap';
import { createPage } from '../Draw/common';

const BlueprintList = (props) => {
  const {
    dispatch,
    loading,
    blueprint: { list },
  } = props;

  useEffect(() => {
    dispatch({
      type: `blueprint/getList`,
    });
  }, []);

  function handleEvent(key, param) {
    switch (key) {
      case 'create':
        return dispatch({
          type: `blueprint/savePage`,
          param: createPage(),
          cb: (data) => {
            history.push(`${ROUTE_MAP.designBlueprintDraw}/${data.id}`);
          },
        });

      case 'edit':
        return history.push(`${ROUTE_MAP.designBlueprintDraw}/${param.id}`);

      default:
        console.log(key);
        return '';
    }
  }

  const columns = [
    {
      key: 'id',
      title: '页面名称',
      dataIndex: 'name',
      width: 230,
    },
    {
      title: '创建时间',
      align: 'center',
      width: 150,
      render: ({ createAt }) => `${moment(createAt).format('YYYY-MM-DD HH:mm')}`,
    },
    {
      title: '修改时间',
      align: 'center',
      width: 80,
      render: ({ updateAt }) => `${moment(updateAt).format('YYYY-MM-DD HH:mm')}`,
    },
    {
      title: '页面类型',
      align: 'center',
      width: 80,
      render: ({ isHome, isUserCenter }) => {
        if (isHome) return '首页';
        if (isUserCenter) return '个人中心';
        return '普通页面';
      },
    },
    {
      title: '状态',
      align: 'center',
      width: 80,
      render: ({ isValid }) => (isValid ? '启用' : '禁用'),
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: ({ id }) => {
        return (
          <>
            <Button
              onClick={() => {
                handleEvent('edit', { id });
              }}
            >
              编辑
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title="团购列表">
      <Card
        extra={
          <Button type="primary" onClick={() => handleEvent('create')}>
            新建页面
          </Button>
        }
      >
        <Table rowKey="id" dataSource={list} columns={columns} loading={loading} />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, blueprint }) => ({
  blueprint,
  loading: loading.effects['blueprint/getList'],
}))(BlueprintList);
