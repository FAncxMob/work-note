import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, message, Popconfirm, Switch } from 'antd';

import ProductsEdit from './ProductsEdit';
import ProductsChooseBox from './ProductsChooseBox';

const Products = (props) => {
  const [grouponInfo, setGrouponInfo] = useState({});
  useEffect(() => {
    props.dispatch({
      type: 'expressDelivery/getGrouponInfo',
      payload: {},
      callback: (res) => {
        setGrouponInfo(res);
      },
    });
  }, []);

  function handleChangeStatus(status, id) {
    status = status ? 'start' : 'end';
    props.dispatch({
      type: 'expressDelivery/changeGrouponStatus',
      payload: { id, status },
      callback: () => {
        const status = grouponInfo.status === 1 ? 2 : 1;
        setGrouponInfo({ ...grouponInfo, status });
        message.success('团购状态已修改');
      },
    });
  }

  return (
    <PageHeaderWrapper
      title="商品管理"
      extra={
        <div className="df align-center pr20">
          <span className="pr10">团购状态:</span>
          <Popconfirm
            title={`是否${grouponInfo.status === 1 ? '关闭' : '开启'}快递团?`}
            onConfirm={() => handleChangeStatus(!(grouponInfo.status === 1), grouponInfo.id)}
            placement="bottom"
          >
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={grouponInfo.status === 1}
            />
          </Popconfirm>
        </div>
      }
    >
      <Card bodyStyle={{ padding: '10px', height: '700px' }}>
        <div className="df">
          <div className="fx1 mr20">
            <ProductsEdit grouponId={grouponInfo.id} />
          </div>
          <ProductsChooseBox grouponId={grouponInfo.id} />
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ expressDelivery }) => ({
  expressDelivery,
}))(Products);
