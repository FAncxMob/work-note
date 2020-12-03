import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Card, Input, Select, Modal, List, message } from 'antd';
import { PlusCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import UFF from '@/utils/UFF';
import ProductModal from './ProductModal';
import styles from './ProductsEdit.less';

const ProductsChooseBox = (props) => {
  const [editVisible, setEditVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [baseCategoryId, setBaseCategoryId] = useState('');
  const [baseName, setBaseName] = useState('');
  const {
    dispatch,
    productLoading,
    grouponId,
    expressDelivery: {
      baseCategoryList,
      products: { items, nextKey },
      currentCategoryId,
    },
  } = props;

  useEffect(() => {
    if (grouponId) {
      dispatch({ type: 'expressDelivery/getBaseCategory' });
      load(true);
    }
  }, [grouponId]);

  useEffect(() => {
    load(true);
  }, [baseCategoryId, baseName]);

  function load(init) {
    const payload = {
      grouponId,
      deliveryType: 'pickup',
    };
    if (!init) payload.nextKey = nextKey;
    if (baseCategoryId) payload.categoryId = baseCategoryId;
    if (baseName) payload.name = baseName;
    dispatch({
      type: 'expressDelivery/getProducts',
      payload,
    });
  }

  async function handleAddProduct(item) {
    if (!currentCategoryId) return message.warning('请先添加并选择分类');
    await setCurrentProduct(item);
    return setEditVisible(true);
  }

  async function handleRemoveProduct(item) {
    const { groupProductId: productId, id: baseProductId } = item;
    Modal.confirm({
      title: '即将从当前团购删除该商品',
      onOk: () => {
        dispatch({
          type: 'expressDelivery/deleteProduct',
          payload: { productId, baseProductId },
          callback: () => message.success('删除成功'),
        });
      },
    });
  }

  function handleAdd(skus, adImages) {
    const {
      id: baseProductId,
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
      adImages,
    };
    if (detailImages) payload.detailImages = detailImages;
    if (video) payload.video = video;
    dispatch({
      type: 'expressDelivery/addProduct',
      payload,
      callback: () => message.success('添加商品成功'),
    });
  }

  function renderTitle() {
    return (
      <Input.Group className="df" compact>
        <Select className="w100" defaultValue="" onChange={(value) => setBaseCategoryId(value)}>
          <Select.Option value="">全部</Select.Option>
          {baseCategoryList.map(({ name, id }) => (
            <Select.Option value={id} key={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
        <Input.Search
          className="text-left fx1"
          placeholder="请输入商品名称搜索"
          onSearch={(value) => setBaseName(value)}
        />
      </Input.Group>
    );
  }

  function renderItem(item) {
    return (
      <div className="df align-center pt10 pb10">
        {item.groupProductId ? (
          <CheckCircleOutlined
            className="iz22 ml10 text-success"
            onClick={() => handleRemoveProduct(item)}
          />
        ) : (
          <PlusCircleOutlined
            className="iz22 cursor-pointer ml10"
            onClick={() => handleAddProduct(item)}
          />
        )}
        <img className="w80 h80 bdr5 ml10 mr10" src={UFF.getProductImage(item.images[0])} alt="" />
        <div className="fx">
          <div className="text-ellipsis w150">{item.name}</div>
          <div>
            划线价：
            {item.minMarketPrice === item.maxMarketPrice
              ? item.minMarketPrice
              : `${item.minMarketPrice} ~ ${item.maxMarketPrice}`}
          </div>
          <div>
            零售价：
            {item.minSales === item.maxSales
              ? item.minSales
              : `${item.minSales} ~ ${item.maxSales}`}
          </div>
          <div>规格数：1</div>
        </div>
      </div>
    );
  }

  function cardProps() {
    return {
      title: renderTitle(),
      className: 'w340',
      headStyle: { padding: '0 10px', background: '#f0f0f0' },
      bodyStyle: { padding: '10px', background: '#f9f9f9' },
      bordered: false,
    };
  }

  return (
    <Card {...cardProps()}>
      <div className={styles.scrollWrap}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => load(false)}
          threshold={200}
          hasMore={!productLoading && !!nextKey}
          useWindow={false}
        >
          <List dataSource={items} renderItem={(item) => renderItem(item)} />
        </InfiniteScroll>
      </div>
      <ProductModal
        visible={editVisible}
        onSubmit={(skus, adImages) => handleAdd(skus, adImages)}
        onClose={() => setEditVisible(false)}
        data={currentProduct}
        type="add"
      />
    </Card>
  );
};

export default connect(({ expressDelivery, loading }) => ({
  expressDelivery,
  productLoading: loading.effects['expressDelivery/getProducts'],
}))(ProductsChooseBox);
