import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import { Button, Modal, Popover, Tag, message, Popconfirm } from 'antd';
import {
  DeleteOutlined,
  DragOutlined,
  ExclamationCircleFilled,
  OrderedListOutlined,
} from '@ant-design/icons';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';

import arrayMove from '@/utils/arrayMove';
import { formatPrice } from '@/utils/format';

import chooseSellCategory from '@/components/ChooseSellCategory';
import UFF from '@/utils/UFF';
import ProductModal from './ProductModal';

import styles from './ProductsEdit.less';

function getRangePriceValue(data, text) {
  const priceArr = data.map((item) => item[text]);
  const max = Math.max(...priceArr);
  const min = Math.min(...priceArr);
  if (max === min) return formatPrice(min);
  return `${formatPrice(min)} ~ ${formatPrice(max)}`;
}

function getRangeIntegerValue(data, text, notice) {
  const priceArr = data.map((item) => item[text]);
  const max = Math.max(...priceArr);
  const min = Math.min(...priceArr);
  if (min === -1) return `不${notice}`;
  if (max === min) return `${notice}${min}${text === 'commissionPercent' ? '%' : ''}`;
  return `${notice}${min}~${max}${text === 'commissionPercent' ? '%' : ''}`;
}

const Tabs = ({ children, defaultActiveKey, addCategory, delCategory, onChange, onSortEnd }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || null);
  // const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveKey(defaultActiveKey), [defaultActiveKey]);
  useEffect(() => onChange(activeKey), [activeKey]);

  const categoryIds = [];
  const tabs = children.map(({ key, props: { disabled, tab } }, index) => {
    categoryIds.push(key);
    return {
      key,
      disabled,
      tab,
      index,
    };
  });

  const DragHandle = sortableHandle(() => (
    <Popover content="拖动排序" placement="right">
      <OrderedListOutlined />
    </Popover>
  ));
  const SortableItem = sortableElement(({ value: { key, tab, index } }) => {
    return (
      <div className={['tab', activeKey === key ? 'active' : ''].join(' ')}>
        <span
          className="name"
          onClick={() => {
            if (key === activeKey) return;
            setActiveKey(key);
            // setActiveIndex(index);
          }}
        >
          {tab}
        </span>
        <div className="operation">
          <Popconfirm
            title="删除分类后所有该分类下商品会全部删除，是否继续？"
            icon={<ExclamationCircleFilled style={{ color: 'red' }} />}
            onClick={(e) => e.stopPropagation()}
            onCancel={(e) => e.stopPropagation()}
            onConfirm={(e) => {
              e.stopPropagation();
              delCategory(key);
              if (activeKey === key) {
                setActiveKey(categoryIds.length > 1 ? categoryIds[0] : null);
                // setActiveIndex(0);
              }
            }}
          >
            <DeleteOutlined className="del" />
          </Popconfirm>
          <DragHandle />
        </div>
      </div>
    );
  });
  const SortableContainer = sortableContainer(({ children: child }) => {
    return <div className="sort-box">{child}</div>;
  });

  return (
    <div className={styles.tabs}>
      <div className="tabs-box">
        <div className="operation-box">
          <Button
            className="mr10"
            onClick={async () => {
              try {
                const res = await chooseSellCategory({ categoryIds });
                if (res.length === 0) return;
                addCategory(res);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            新增分类
          </Button>
        </div>
        <SortableContainer
          onSortEnd={onSortEnd}
          useDragHandle
          helperClass="drag"
          helperContainer={() => {
            return window.document.getElementsByClassName('sort-box')[0];
          }}
        >
          {tabs.map((tab, index) => (
            <SortableItem index={index} key={index} value={tab} />
          ))}
        </SortableContainer>
        {/* {activeKey === null ? null : (
          <div className="line" style={{ top: `${activeIndex * 32 + 60}px` }} />
        )} */}
      </div>
      <div className="content-box">
        {children.map((item) => {
          return (
            <div key={item.key} className={`${item.key === activeKey ? 'db' : 'dn'}`}>
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TabPane = ({ children, index, onSortEnd }) => {
  const SortableContainer = sortableContainer(({ children: child }) => (
    <div index={index} className="content">
      {child}
    </div>
  ));

  return (
    <SortableContainer
      useDragHandle
      axis="xy"
      helperClass="drag"
      helperContainer={() => window.document.querySelector(`div[index='${index}']`)}
      onSortEnd={onSortEnd}
    >
      {children}
    </SortableContainer>
  );
};

const ProductItem = ({ data, onAdd, onDelete, editLoading, deleteLoading, index }) => {
  const DragHandle = sortableHandle(() => (
    <Popover content="拖动排序">
      <DragOutlined className="drag-btn" />
    </Popover>
  ));
  const SortableItem = sortableElement(({ children }) => <>{children}</>);

  return (
    <SortableItem index={index}>
      <div className="product-item">
        <div className="name-box">
          <DragHandle />
          <span className="name">{data.name}</span>
        </div>
        <div className="info-box">
          <img className="" src={data.images[0] && UFF.getProductImage(data.images[0])} alt="" />
          <div className="info">
            <div>商品ID：{data.id}</div>
            <div>
              划线价：
              <b>
                <s>￥{getRangePriceValue(data.skus, 'marketPrice')}</s>
              </b>
            </div>
            <div>
              零售价：<b>￥{getRangePriceValue(data.skus, 'sales')}</b>
            </div>
            <div className="tag">
              <Tag color="magenta">{getRangeIntegerValue(data.skus, 'limit', '限购')}</Tag>
              <Tag color="geekblue">{getRangeIntegerValue(data.skus, 'stock', '限售')}</Tag>
              <Tag color="cyan">{getRangeIntegerValue(data.skus, 'baseSaleCount', '基销')}</Tag>
              <Tag color="gold">{getRangeIntegerValue(data.skus, 'commissionPercent', '佣金')}</Tag>
            </div>
          </div>
        </div>
        <div className="operation-box">
          <Button onClick={() => onAdd(data.skus)} loading={editLoading}>
            编辑
          </Button>
          <Button danger onClick={() => onDelete()} loading={deleteLoading}>
            删除
          </Button>
        </div>
      </div>
    </SortableItem>
  );
};

const ProductsEdit = (props) => {
  const [defaultActiveKey, setDefaultActiveKey] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const {
    dispatch,
    deleteLoading,
    editLoading,
    grouponId,
    expressDelivery: { categoryList = [], categoryProducts = [], currentCategoryId },
  } = props;

  function loadCategory() {
    dispatch({
      type: 'expressDelivery/getCategory',
      payload: { groupBuyId: grouponId },
      callback: ({ categoryData }) => {
        setDefaultActiveKey(categoryData[0].id);
        dispatch({
          type: 'expressDelivery/setCurrentCategory',
          payload: {
            categoryId: categoryData[0].id,
          },
        });
      },
    });
  }

  function loadCategoryProducts(categoryId) {
    dispatch({
      type: 'expressDelivery/setCurrentCategory',
      payload: {
        categoryId,
      },
    });
    dispatch({
      type: 'expressDelivery/getCategoryProducts',
      payload: {
        groupBuyId: grouponId,
        categoryId,
      },
      callback: (res) => {
        console.log(res);
        // const { categoryData } = res;
        // setDefaultActiveKey(categoryData[0].id);
      },
    });
  }

  function handleEdit(item) {
    setCurrentProduct(item);
    setEditVisible(true);
  }

  function handleDelete(productId, baseProductId) {
    Modal.confirm({
      title: '即将从当前分类删除该商品',
      onOk: () => {
        dispatch({
          type: 'expressDelivery/deleteProduct',
          payload: { productId, baseProductId },
          callback: () => message.success('删除成功'),
        });
      },
    });
  }

  function handleSubmit(skus) {
    const {
      id,
      baseProductId,
      name,
      desc,
      images,
      detailImages,
      video,
      tags,
      skuAttrs,
    } = currentProduct;
    const payload = {
      groupBuyId: grouponId,
      id,
      baseProductId,
      name,
      desc,
      images,
      tags,
      skuAttrs,
      skus,
      saleMode: '2',
      categoryIds: [currentCategoryId],
      deliveryType: 'pickup',
    };
    if (detailImages) payload.detailImages = detailImages;
    if (video) payload.video = video;
    dispatch({
      type: 'expressDelivery/editProduct',
      payload,
      callback: () => message.success('保存成功！'),
    });
  }

  function addCategory(categoryIds) {
    dispatch({
      type: 'expressDelivery/addCategory',
      payload: { categoryIds, grouponId },
    });
  }
  function delCategory(categoryId) {
    dispatch({
      type: 'expressDelivery/delCategory',
      payload: { categoryId, grouponId, categoryProducts },
    });
  }

  function sortCategory({ oldIndex, newIndex }) {
    const categoryIds = arrayMove(
      categoryList.reduce((arr, current) => {
        arr.push(current.id);
        return arr;
      }, []),
      oldIndex,
      newIndex,
    );

    dispatch({
      type: 'expressDelivery/sortCategory',
      payload: { categoryIds, grouponId },
    });
  }

  function sortProducts({ oldIndex, newIndex }) {
    const productIds = arrayMove(
      categoryProducts.reduce((arr, current) => {
        arr.push(current.id);
        return arr;
      }, []),
      oldIndex,
      newIndex,
    );

    dispatch({
      type: 'expressDelivery/sortProducts',
      payload: {
        categories: [
          {
            id: currentCategoryId,
            productIds,
          },
        ],
        grouponId,
      },
    });
  }

  useEffect(() => {
    if (grouponId) loadCategory();
    return () => {
      dispatch({ type: 'expressDelivery/clearData' });
    };
  }, [grouponId]);

  return (
    <div className="h100p p10 border-base bdr10 df flex-column">
      <Tabs
        className="fx1 border-top"
        defaultActiveKey={defaultActiveKey}
        categoryList={categoryList}
        addCategory={addCategory}
        delCategory={delCategory}
        onChange={loadCategoryProducts}
        onSortEnd={sortCategory}
      >
        {categoryList.map((item) => (
          <TabPane tab={item.name} index={item.id} key={item.id} onSortEnd={sortProducts}>
            {categoryProducts.map((data, index) => (
              <ProductItem
                key={data.id}
                data={data}
                index={index}
                categoryId={item.id}
                deleteLoading={deleteLoading}
                editLoading={editLoading}
                onAdd={() => handleEdit(data)}
                onDelete={() => handleDelete(data.id, data.baseProductId)}
              />
            ))}
          </TabPane>
        ))}
      </Tabs>
      <ProductModal
        visible={editVisible}
        onSubmit={(value) => handleSubmit(value)}
        onClose={() => setEditVisible(false)}
        data={currentProduct}
      />
    </div>
  );
};

export default connect(({ expressDelivery, loading }) => ({
  expressDelivery,
  categoryLoading: loading.effects['expressDelivery/getCategoryProducts'],
  deleteLoading: loading.effects['expressDelivery/deleteProduct'],
  editLoading: loading.effects['expressDelivery/editProduct'],
}))(ProductsEdit);
