import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';

import ProductsEdit from './ProductsEdit';
import ProductsChooseBox from './ProductsChooseBox';

const RenderProductsShowBox = () => (
  <div className="fx1 mr20">
    <ProductsEdit />
  </div>
);

const Products = () => (
  <PageHeaderWrapper title="团购商品">
    <Card bodyStyle={{ padding: '10px', height: '700px' }}>
      <div className="df">
        <RenderProductsShowBox />
        <ProductsChooseBox />
      </div>
    </Card>
  </PageHeaderWrapper>
);

export default Products;
