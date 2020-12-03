import React, { useEffect } from 'react';
import { Table } from 'antd';
import { withRouter } from 'react-router-dom';

const defaultPagination = {
  currentPage: 1,
  pageSize: 10,
};

// TODO 该处console留下，为了方便后期调试 by 肖飞

function equal(obj1, obj2) {
  const props1 = Object.getOwnPropertyNames(obj1);
  const props2 = Object.getOwnPropertyNames(obj2);
  if (props1.length !== props2.length) return false;
  for (let i = 0, max = props1.length; i < max; i++) {
    const propName = props1[i];
    if (obj1[propName] !== obj2[propName]) return false;
  }
  return true;
}

const CustomerTable = (props) => {
  const {
    data = {},
    rowRadioSelection = null,
    rowKey,
    showHeader,
    hidePagination = false,
    param,
    location,
    history,
    ...rest
  } = props;
  const { pathname, query } = location;
  const { list = [], pagination = {} } = data;

  pagination.pageSizeOptions = ['10', '20', '50', '100'];

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    ...pagination,
  };

  if (rest.showSizeChanger === false) {
    paginationProps.showSizeChanger = false;
  }

  if (rest.showQuickJumper === false) {
    paginationProps.showQuickJumper = false;
  }

  const handleTableChange = ({ current: currentPage, pageSize }) => {
    const paramData = JSON.parse(JSON.stringify(param));

    history.push({
      pathname,
      query: {
        ...paramData,
        currentPage,
        pageSize,
      },
    });
  };

  const load = () => {
    const { onTableChange } = props;
    // console.log('exec load:', query);
    if (onTableChange) onTableChange({ ...pagination, ...defaultPagination, ...query });
  };

  useEffect(() => {
    // console.log('load success');
    load();
  }, [location]);

  useEffect(() => {
    // console.log('on param: ', query, 'query', param, 'param');
    if (!Object.keys(param).length) return;
    if (equal(query, param)) return;
    if (equal(defaultPagination, param)) return;

    // console.log('on param: 2');
    history.push({
      pathname,
      query: param,
    });
  }, [param]);

  return (
    <div>
      <Table
        rowKey={rowKey || 'key'}
        dataSource={list}
        rowSelection={rowRadioSelection}
        pagination={hidePagination ? false : paginationProps}
        showHeader={showHeader}
        onChange={handleTableChange}
        {...rest}
      />
    </div>
  );
};

export default withRouter(CustomerTable);
