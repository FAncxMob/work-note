import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, Card, Popover, Button, Spin } from 'antd';
import { arrayMove, SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { DragOutlined } from '@ant-design/icons';
import { sortBanner } from '@/services/banner';
import EditForm from './components/editForm';

const MAX_NUM = 5;
const ACTION = {
  getList: 'bannerModel/getList',
  addBannerForm: 'bannerModel/addBannerForm',
  editBanner: 'bannerModel/editBanner',
  saveList: 'bannerModel/saveList',
  delete: 'bannerModel/delete',
};

const DragHandle = sortableHandle(() => (
  <Popover content="拖动排序">
    <DragOutlined className="cursor-drag" />
  </Popover>
));
const SorItem = SortableElement(({ value, renderItem, onSubmit, onDelete }) => {
  return renderItem(value, onSubmit, onDelete);
});

// distance={1}
// axis="xy"
// helperClass="SortableHelper"
// isVertical
// onSortEnd
// onPreview
// onDelete
const SortList = SortableContainer(
  ({ dataSource, renderItem = () => <div />, onSubmit = () => {}, onDelete = () => {} }) => {
    return (
      <div className="sort-table-list-wrap">
        <Row gutter={24}>
          {dataSource.map((value, index) => {
            return (
              <Col span={8} key={value.id || value.key}>
                {value.id ? (
                  <SorItem
                    index={index}
                    value={value}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                    renderItem={renderItem}
                  />
                ) : (
                  renderItem(value, onSubmit, onDelete)
                )}
              </Col>
            );
          })}
        </Row>
      </div>
    );
  },
);

const renderItem = (item, onSubmit, onDelete) => {
  return (
    <Card className="mb25">
      {item.id ? (
        <div className="df align-center">
          <DragHandle />
          <span>序号{item.index + 1}</span>
        </div>
      ) : null}
      <EditForm value={item} onSubmit={onSubmit} onDelete={onDelete} />
    </Card>
  );
};

const Banner = (props) => {
  const [sortLoading, setSortLoading] = useState(false);

  const {
    dispatch,
    loading,
    bannerModel: { list = [] },
  } = props;

  function handleAddBannerFrom() {
    dispatch({
      type: ACTION.addBannerForm,
    });
  }

  function load() {
    dispatch({
      type: ACTION.getList,
    });
  }

  async function onSortEnd({ oldIndex, newIndex }) {
    const sortList = arrayMove([...list], oldIndex, newIndex);
    // [sortList[oldIndex], sortList[newIndex]] = [sortList[newIndex], sortList[oldIndex]];

    const requestList = [];
    const { length } = sortList;
    sortList.forEach((i, index) => {
      if (i.id) {
        const param = { id: i.id, sort: length - index };
        requestList.push(sortBanner(param));
      }
    });
    setSortLoading(true);
    await Promise.all(requestList);
    setSortLoading(false);
    dispatch({
      type: ACTION.saveList,
      payload: sortList,
    });
  }

  function handleDelete(data) {
    dispatch({
      type: ACTION.delete,
      payload: data,
    });
  }

  const onSubmit = (val) => {
    const { image: fileList, linkOption = {}, title: name, id, sort } = val;
    const { linkType, linkVal = '' } = linkOption;
    const image = fileList[0] || '';
    dispatch({
      type: ACTION.editBanner,
      payload: {
        id,
        sort,
        url: typeof image === 'string' ? image : image.filePath,
        toUrl: linkVal,
        linkType,
        name,
        type: 3,
      },
    });
  };

  const renderExplain = <div />;

  useEffect(() => {
    load();
  }, []);

  return (
    <PageHeaderWrapper title="Banner管理" content={renderExplain}>
      <Card
        extra={
          <Button
            disabled={list.length >= MAX_NUM}
            type="primary"
            onClick={() => {
              handleAddBannerFrom();
            }}
          >
            +新增Banner
          </Button>
        }
      >
        <Spin spinning={loading || sortLoading}>
          <SortList
            onSortEnd={onSortEnd}
            onDelete={handleDelete}
            dataSource={list}
            renderItem={renderItem}
            onSubmit={onSubmit}
            useDragHandle
            axis="xy"
          />
        </Spin>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, bannerModel }) => ({
  bannerModel,
  loading: loading.models.bannerModel,
}))(Banner);
