import React, { useState, useEffect } from 'react';
import { history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerTable from '@/components/CustomerTable/index_.jsx';
import { Card } from 'antd';

import tableColumns from './listColumns';
import SearchForm from './components/SearchForm.jsx';
import actionMap from '../actionMap';

const GroupHeaderList = (props) => {
  const [formValues, setFormValues] = useState({});
  const [loaded, setLoaded] = useState(false);
  const { dispatch } = props;
  const {
    location: { query = {} },
  } = history;

  const {
    groupHeader: { groupHeaderList = [], verifyStatus = [], hostStatus = [] },
    loading,
  } = props;

  useEffect(() => {
    return () => {};
  }, []);

  const loadTableList = () => {
    dispatch({
      type: actionMap.getList,
      payload: query,
    });
    setLoaded(true);
  };

  function updateFormValues(param) {
    setFormValues((pre) => ({ ...pre, ...param }));
  }

  function handleStandardTableChange(pagination) {
    const { pageSizeOptions, current, total, currentPage, pageSize, ...rest } = pagination;
    const params = {
      currentPage: currentPage || current,
      pageSize,
      ...rest,
    };
    updateFormValues(params);
    loadTableList();
  }

  return (
    <PageHeaderWrapper title="团长列表">
      <Card
        title={
          <SearchForm
            dispatch={dispatch}
            loaded={loaded}
            verifyStatus={verifyStatus}
            updateFormValues={(param) => updateFormValues(param)}
          />
        }
      >
        <CustomerTable
          rowKey="captainId"
          loading={loading}
          data={groupHeaderList}
          columns={tableColumns({
            verifyStatus,
            hostStatus,
            dispatch,
            loadTableList,
          })}
          onTableChange={handleStandardTableChange}
          param={formValues}
          // scroll={{ x: 1800 }}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, groupHeader }) => ({
  groupHeader,
  loading: loading.effects[actionMap.getList],
}))(GroupHeaderList);
