import React from 'react';
import { Table } from 'antd';
import styles from './index.less';

const SimpleTable = (props) => {
  const {
    data = {},
    rowRadioSelection = null,
    rowKey,
    showHeader,
    hidePagination = false,
    ...rest
  } = props;

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

  const handleTableChange = (newPagination, filters, sorter) => {
    const { onChange } = props;
    if (onChange) {
      onChange(newPagination, filters, sorter);
    }
  };

  return (
    <div className={styles.simpleTable}>
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

export default SimpleTable;
