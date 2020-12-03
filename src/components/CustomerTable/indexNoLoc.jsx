import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { withRouter, history } from 'umi';
import emitter from '@/utils/EventEmitter';
// import styles from './index.less';

const defaultPagination = {
  currentPage: 1,
};

@withRouter
class SimpleTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleTableChange = (pag) => {
    const {
      onTableChange,
      data: { pagination }
     } = this.props;

    if (onTableChange) onTableChange({ ...pagination, ...pag, ...defaultPagination });
  };

  render() {
    const {
      data = {},
      rowRadioSelection = null,
      rowKey,
      showHeader,
      hidePagination = false,
      onTableChange,
      ...rest
    } = this.props;
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

    return (
      <div>
        <Table
          rowKey={rowKey || 'key'}
          dataSource={list}
          rowSelection={rowRadioSelection}
          pagination={hidePagination ? false : paginationProps}
          showHeader={showHeader}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default SimpleTable;
