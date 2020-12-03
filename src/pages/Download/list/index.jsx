/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import { connect, history } from 'umi';
import { Card, Button, Progress, message } from 'antd';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import config from '@/utils/config';

const generateStatus = ['等待生成', '生成成功', '生成失败', '正在生成'];

const DownloadList = (props) => {
  const {
    dispatch,
    download: { downloadList },
    loading,
    retryLoading,
  } = props;
  const [formValues, setFormValues] = useState({});
  const { query } = history.location;

  const columns = [
    {
      key: 'ossId',
      title: '申请时间',
      dataIndex: 'applyTime',
      align: 'center',
      width: 150,
    },
    {
      title: '文件类型',
      dataIndex: 'typeName',
      align: 'center',
      width: 180,
    },
    {
      title: '完成时间',
      dataIndex: 'generateEndTime',
      align: 'center',
      width: 180,
    },
    {
      title: '文件编号',
      dataIndex: 'ossId',
      width: 200,
      align: 'center',
    },
    {
      title: '生成进度',
      dataIndex: 'progress',
      align: 'center',
      width: 200,
      render: (text) => (
        <Progress
          percent={Number(text)}
          status={Number(text) === 100 ? 'success' : 'active'}
          size="small"
        />
      ),
    },
    {
      title: '文件状态',
      dataIndex: 'generateStatus',
      align: 'center',
      width: 120,
      render: (value) => generateStatus[value],
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: ({ generateStatus, ossId }) => {
        return (
          <>
            {generateStatus === 1 ? (
              <Button
                type="link"
                onClick={() => {
                  window.location.href = `${config.outerApiUrl}/export/download/${ossId}`;
                }}
              >
                下载
              </Button>
            ) : null}
            {generateStatus === 2 ? (
              <Button type="link" loading={retryLoading} onClick={() => handleRetry(ossId)}>
                重试
              </Button>
            ) : null}
          </>
        );
      },
    },
  ];

  function handleRetry(ossId) {
    dispatch({
      type: 'download/retry',
      payload: { ossId },
      callback: () => message.success('文件已重新下载'),
    });
  }

  function load(params) {
    const payload = { ...params, ...query };
    dispatch({
      type: 'download/getDownloadList',
      payload,
    });
  }

  function handleStandardTableChange(response) {
    const { pageSizeOptions, current, total, currentPage, pageSize, ...rest } = response;
    const params = {
      currentPage: currentPage || current,
      pageSize,
      ...rest,
    };
    setFormValues({ ...formValues, ...params });
    load();
  }

  return (
    <PageHeaderWrapper title="团购列表">
      <Card title="文件下载管理" extra={<Button type="primary">刷新</Button>}>
        <CustomerTable
          rowKey="ossId"
          loading={loading}
          data={downloadList}
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

export default connect(({ loading, download }) => ({
  download,
  loading: loading.effects['download/getDownloadList'],
  retryLoading: loading.effects['download/retry'],
}))(DownloadList);
