import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, message, Popconfirm, Spin, Empty } from 'antd';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import arrayMove from '@/utils/arrayMove';

import EditModal from './EditModal';
import PatchAddModal from './PatchAddModal';

import styles from './index.less';

const DEFAULT_PAGESIZE = 36; // 默认每页的数据量

const Category = (props) => {
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [initValue, setInitValue] = useState({});
  const [formValues, setFormValues] = useState({
    tagName: '',
    pageSize: DEFAULT_PAGESIZE,
    currentPage: 1,
  });

  const {
    goodsWarehouseCategory: { list },
    loading,
    dispatch,
  } = props;

  async function load(option) {
    const { dispatch } = props;
    const param = option || formValues;
    setFormValues({ ...formValues, ...param });
    dispatch({
      type: 'goodsWarehouseCategory/getList',
      payload: param,
    });
  }

  useEffect(() => {
    load();
  }, []);

  function handleDelete(id) {
    const { dispatch } = props;
    dispatch({
      type: 'goodsWarehouseCategory/delete',
      payload: { id },
      callback: () => load(),
    });

    message.success('删除成功');
  }

  function handleDoSth(type, item = '') {
    setVisible(true);
    if (type === 'add') {
      setTitle('添加分类');
      setInitValue({});
    } else if (type === 'edit') {
      setTitle('编辑分类');
      setInitValue(item);
    }
  }

  const MyTag = ({ item, index, dispatch }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
      item: { type: 'test' },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      begin(monitor) {
        // console.log('拖拽开始', monitor);
        return {
          index,
        };
      },
    });

    const [{ isOver }, drop] = useDrop({
      accept: 'test',
      drop: (item, monitor) => {
        const dragIndex = item.index; // 拖拽目标的Index
        const hoverIndex = index; // 放置目标Index
        dispatch({
          type: 'goodsWarehouseCategory/saveList',
          payload: arrayMove(list, dragIndex, hoverIndex),
        });
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    drop(drag(ref));

    return (
      <div
        ref={ref}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
        className="p5 dib"
      >
        <div key={item.id} className={styles.item}>
          <div>{item.name}</div>
          <div className="df justify-around">
            <a onClick={() => handleDoSth('edit', item)} className="p5">
              编辑
            </a>
            {item.isDefault ? null : (
              <Popconfirm
                title="您确定要删除该分类吗?"
                onConfirm={() => handleDelete(item.id)}
                okText="确定"
                cancelText="取消"
              >
                <a className="p5">删除</a>
              </Popconfirm>
            )}
          </div>
        </div>
      </div>
    );
  };

  const successCallback = async (correctTags) => {
    // 批量添加
    props.dispatch({
      type: 'goodsWarehouseCategory/add',
      payload: { name: correctTags },
      callback: () => {
        message.success('添加成功');
        load();
      },
    });
  };

  const RenderTags = ({ loading, list, dispatch }) => {
    return (
      <div className="df flex-wrap justify-between">
        <div>
          {/* 转圈圈 */}
          {loading && list.length === 0 ? (
            <Spin className="margin-auto w100p" spinning={loading} />
          ) : null}
          {/* 无数据 */}
          {list.length === 0 && !loading ? <Empty className="margin-auto w100p" /> : null}
          {list.length !== 0
            ? list.map((tag, index) => (
                <MyTag key={tag.id} index={index} item={tag} dispatch={dispatch} />
              ))
            : null}
        </div>
        {new Array(20).fill('').map((v, i) => (
          <div key={i} className="h0 w164" />
        ))}
      </div>
    );
  };

  return (
    <PageHeaderWrapper title="分类">
      <DndProvider backend={HTML5Backend}>
        <Card
          title={
            <>
              {/* 批量添加 */}
              <Button onClick={() => setAddVisible(true)} type="primary">
                添加分类
              </Button>
            </>
          }
        >
          <RenderTags loading={loading} list={list} dispatch={dispatch} />
        </Card>
      </DndProvider>
      <EditModal
        initValues={initValue}
        onOk={load}
        title={title}
        setVisible={setVisible}
        visible={visible}
      />
      <PatchAddModal
        keyword="商品分类"
        onOk={successCallback}
        setVisible={setAddVisible}
        visible={addVisible}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ goodsWarehouseCategory, loading }) => ({
  goodsWarehouseCategory,
  loading: loading.models.goodsWarehouseCategory,
}))(Category);
