import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DescriptionList from '@/components/DescriptionList';
import { Card, Button, Tag, Modal, Image } from 'antd';
import routeMap from '@/routeMap';
import UFF from '@/utils/UFF';
import actionMap from '../../actionMap';
import { StatusChangeModalConfig } from '../components/ModalConfig.jsx';
import VerifyModal from '../components/VerifyModal/index.jsx';
import styles from './index.less';

const { Description } = DescriptionList;

const headStyle = { background: '#fafafa', borderColor: '#e8e8e8', fontSize: '14px' };
const bodyStyle = { margin: '1px 0 10px', background: '#fafafa' };

const Detail = (props) => {
  const { dispatch } = props;
  const {
    location: { query = {} },
  } = history;

  const {
    groupHeader: { groupHeaderDetail: detail, verifyStatus, hostStatus },
    loading,
  } = props;

  const loadDetail = () => {
    dispatch({
      type: actionMap.getDetail,
      payload: {
        captainId: query.id || '',
      },
    });
  };

  useEffect(() => {
    loadDetail();
  }, []);

  const renderStatus = (status, mapList) => {
    const current = mapList.find((item) => String(item.value) === String(status));
    if (current) return <Tag color={current.color}>{current.text}</Tag>;
    return '--';
  };

  const renderImg = (images = '') => {
    images = images.split(',');
    return (
      <>
        {images.map((item, index) => (
          <Image className="w50 h50 mr10" key={index} src={UFF.getProductImage(item)} />
        ))}
      </>
    );
  };
  const renderBtn = () => {
    const { status, captainId } = detail.captainInfo;
    let arr = [
      {
        text: '审核',
        onClick: () => VerifyModal({ captainId, reLoad: loadDetail, dispatch }),
      },
      {
        text: '编辑',
        onClick: () => history.push(`${routeMap.captainEdit}?id=${captainId}`),
      },
      {
        text: '歇业',
        onClick: () =>
          Modal.confirm(
            StatusChangeModalConfig({ captainId, status: 0, dispatch, reLoad: loadDetail }),
          ),
      },
      {
        text: '禁用',
        onClick: () =>
          Modal.confirm(
            StatusChangeModalConfig({ captainId, status: 1, dispatch, reLoad: loadDetail }),
          ),
      },
      {
        text: '上线',
        onClick: () =>
          Modal.confirm(
            StatusChangeModalConfig({ captainId, status: 2, dispatch, reLoad: loadDetail }),
          ),
      },
      {
        text: '启用',
        onClick: () =>
          Modal.confirm(
            StatusChangeModalConfig({ captainId, status: 3, dispatch, reLoad: loadDetail }),
          ),
      },
    ];
    // 0:审核中 1:营业中 2:审核失败 3:已禁用 4:歇业中
    switch (`${status}`) {
      case '0':
        arr = [arr[0], arr[1]];
        break;
      case '1':
        arr = [arr[2], arr[3], arr[1]];
        break;
      case '2':
        arr = [arr[1]];
        break;
      case '3':
        arr = [arr[5], arr[1]];
        break;
      case '4':
        arr = [arr[4], arr[3], arr[1]];
        break;
      default:
        arr = [];
        break;
    }
    return (
      <>
        {arr.map((item, index) => (
          <Button className="mr10" type="primary" key={index} onClick={() => item.onClick()}>
            {item.text}
          </Button>
        ))}
      </>
    );
  };

  return (
    <PageHeaderWrapper title="团长明细">
      <Card title="基本信息" bordered={false} headStyle={headStyle} bodyStyle={bodyStyle}>
        <DescriptionList className={styles.rowWrapper} col={3} layout="horizontal">
          <Description term="团长编码">{detail.captainInfo.captainId}</Description>
          <Description term="团长姓名">{detail.captainInfo.contactName}</Description>
          <Description term="团长电话">{detail.captainInfo.contactMobile}</Description>
          {detail.bankInfo ? (
            <Description term="持卡人姓名">{detail.bankInfo.owner || '--'}</Description>
          ) : null}
          {detail.bankInfo ? (
            <Description term="收款账号">{detail.bankInfo.cardNo || '--'}</Description>
          ) : null}
          {/* <Description term="是否允许提现">
            {String(detail.authInfo.status) === '1' ? '允许' : '不允许'}
          </Description> */}
          <Description term="状态">
            {renderStatus(detail.captainInfo.status, verifyStatus)}
          </Description>
          <Description term="微信群截图">{renderImg(detail.captainInfo.groupImg)}</Description>
        </DescriptionList>
      </Card>
      {detail.authInfo ? (
        <Card title="主体信息" bordered={false} headStyle={headStyle} bodyStyle={bodyStyle}>
          <DescriptionList className={styles.rowWrapper} col={3} size="large" layout="horizontal">
            <Description term="主体类型">个人</Description>
            <Description term="身份证姓名">{detail.authInfo.name || '--'}</Description>
            <Description term="身份证号码">{detail.authInfo.idcard || '--'}</Description>
            <Description term="身份证地址">{detail.authInfo.address || '--'}</Description>
            <Description term="身份证照片">
              {renderImg(`${detail.authInfo.cardPositive},${detail.authInfo.cardNegative}`)}
            </Description>
          </DescriptionList>
        </Card>
      ) : null}

      <Card title="自提点信息" bordered={false} headStyle={headStyle} bodyStyle={bodyStyle}>
        <DescriptionList className={styles.rowWrapper} col={3} size="large" layout="horizontal">
          <Description term="自提点名称">{detail.captainInfo.name}</Description>
          <Description term="自提点类型">{detail.captainInfo.typeName}</Description>
          <Description term="自提点（门头）图片">
            {renderImg(detail.captainInfo.storeImg)}
          </Description>
          <Description term="收货地址">
            {detail.captainInfo.province +
              detail.captainInfo.city +
              detail.captainInfo.area +
              detail.captainInfo.communityAddress +
              detail.captainInfo.detail || ''}
          </Description>
        </DescriptionList>
      </Card>
      <Card bordered={false} headStyle={headStyle} bodyStyle={bodyStyle}>
        {renderBtn()}
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading, groupHeader }) => ({
  groupHeader,
  loading: loading.effects[actionMap.getDetail],
}))(Detail);
