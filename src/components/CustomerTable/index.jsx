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

  componentDidMount() {
    const unHistoryListen = this.props.history.listen(() => {
      setTimeout(() => {
        this.load();
      }, 0);
    });

    const unEmitterListen = emitter.on('reload', () => {
      if (!this.props.param) return;
      const { currentPage, pageSize, ...rest } = this.props.param;

      history.push({
        pathname: this.props.location.pathname,
        query: {
          currentPage,
          pageSize,
          ...rest,
        },
      });
    });

    this.setState({ unHistoryListen, unEmitterListen });
  }

  componentWillUnmount() {
    this.state.unHistoryListen();
    this.state.unEmitterListen();
  }

  handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    const param = JSON.parse(JSON.stringify(this.props.param));
    delete param.currentPage;
    delete param.pageSize;

    history.push({
      pathname: this.props.location.pathname,
      query: {
        currentPage: current,
        pageSize,
        ...param,
      },
    });
  };

  load() {
    const {
      onChange,
      data: { pagination },
      location: { query },
    } = this.props;

    if (onChange) onChange({ ...pagination, ...defaultPagination, ...query });
  }

  render() {
    const {
      data = {},
      rowRadioSelection = null,
      rowKey,
      showHeader,
      hidePagination = false,
      onChange,
      param,
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
