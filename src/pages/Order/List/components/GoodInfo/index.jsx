import React from 'react';
import Uff from '@/utils/UFF';

const REFUSEURL = require('@/images/defaultShopLogo.jpg');

const Index = (props) => {
  const { skus } = props.data;
  return (
    <div>
      {skus.map((item, index) => (
        <div key={index} className="df align-center mb8 bgc-base pl6 pr6">
          <img
            alt=""
            src={item.image ? Uff.getOrderListImage(item.image) : REFUSEURL}
            className="w45 h45 shrink-0"
          />
          <div className="fx1 pl8">
            <p className="text-left text-ellipsis">
              {item.spuName}({item.skuName || '--'})
            </p>
            <div className="df align-center justify-between">
              <span>¥{item.goodsPrice}</span>
              <span>×{item.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Index;
