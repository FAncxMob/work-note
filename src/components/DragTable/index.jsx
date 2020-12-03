import { Component } from 'react';
import { Table } from 'antd';
import { arrayMove, sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';

import './index.less';

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

class SortableTable extends Component {
  onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
      const { dataSource, dragEnd } = this.props;
      const newData = arrayMove([...dataSource], oldIndex, newIndex);
      if (dragEnd) dragEnd(newData);
    }
  }

  DraggableBodyRow({ className, style, ...restProps }) {
    const { dataSource } = this.props;
    const index = dataSource.findIndex((x) => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  }

  render() {
    const { dataSource = [], columns = [] } = this.props;

    const DraggableContainer = (props) => (
      <SortableContainer
        useDragHandle
        distance={10}
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd.bind(this)}
        {...props}
      />
    );

    const sortHeader = {
      title: '拖动排序',
      width: 30,
      align: 'center',
      className: 'drag-visible',
      render: () => <DragHandle />,
    };

    columns.unshift(sortHeader);

    return (
      <Table
        {...this.props}
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: this.DraggableBodyRow.bind(this),
          },
        }}
      />
    );
  }
}

export default SortableTable;
