import React, { useState, useEffect } from 'react';
import { history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Input, Select, message, Steps } from 'antd';
import Uploader from '@/components/Uploader';
import AMapPOI from '@/components/AMap/AMapPOI';
import { isEmptyObject } from '@/utils/utils';
import routeMap from '@/routeMap';
import actionMap from '../../actionMap';
import styles from './index.less';

const { Step } = Steps;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const tailFormItemLayout = {
  wrapperCol: { offset: 6, span: 12 },
};
const { Option } = Select;

const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
];

const Statistics = (props) => {
  const { dispatch } = props;
  const [initAddressInfo, setInitAddressInfo] = useState({});
  const [groupImg, setGroupImg] = useState([]);
  const [storeImg, setStoreImg] = useState([]);

  const [current, setCurrent] = useState(0);

  const [formRef] = Form.useForm();
  const {
    location: { query = {} },
  } = history;

  const {
    groupHeader: { groupHeaderDetail = {}, pickupTypeList = [] },
  } = props;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const load = () => {
    if (getType() === 'edit') {
      dispatch({
        type: actionMap.getDetail,
        payload: {
          captainId: query.id || '',
        },
      });
    }

    dispatch({
      type: actionMap.getPickupType,
      payload: {},
    });
  };

  const initForm = () => {
    if (isEmptyObject(groupHeaderDetail.captainInfo)) return;
    const {
      contactName,
      contactMobile,
      name,
      type,
      storeImg,
      groupImg,
      lat,
      lng,
      province,
      city,
      area,
      communityAddress,
      detail,
    } = groupHeaderDetail.captainInfo;
    formRef.setFieldsValue({
      contactName,
      contactMobile,
      name,
      type,
      detail,
    });
    setGroupImg(groupImg.split(','));
    setStoreImg(storeImg.split(','));
    setInitAddressInfo({
      location: { lat, lng },
      pname: province,
      adname: area,
      cityname: city,
      address: communityAddress,
    });
  };

  function getType() {
    return history.location.pathname === routeMap.captainEdit ? 'edit' : 'add';
  }

  useEffect(() => {
    if (getType() === 'add') return;
    initForm();
  }, [groupHeaderDetail]);

  useEffect(() => {
    load();
  }, []);

  const getImgPathArr = (fileList = []) => {
    return fileList
      .map((item) => {
        if (typeof item === 'object') return item.filePath;
        return item;
      })
      .join(',');
  };

  const nullTips = (tips) => {
    message.warning(tips);
    return false;
  };

  const checkForm = (param) => {
    if (!param.contactName) return nullTips('请填写团长姓名');
    if (!param.contactMobile) return nullTips('请填写团长联系电话');
    if (!param.groupImg) return nullTips('请上传微信群截图');
    if (!param.name) return nullTips('请填写自提点名称');
    if (!param.type) return nullTips('请选择自提点类型');
    if (!param.storeImg) return nullTips('请上传自提点门头照片');
    if (!param.communityAddress) return nullTips('请选择收货地址');
    if (!param.detail) return nullTips('请输入详细地址');
    return true;
  };

  const handleSave = () => {
    const {
      contactMobile,
      contactName,
      name,
      type,
      detail,
      addressInfo,
    } = formRef.getFieldsValue();
    const newStoreImg = getImgPathArr(storeImg);
    const newGroupImg = getImgPathArr(groupImg);
    const {
      pname,
      cityname,
      adname,
      address,
      location: { lng, lat },
    } = { ...initAddressInfo, ...addressInfo };

    const param = {
      captainId: query.id,
      contactMobile,
      contactName,
      name,
      type,
      detail,
      storeImg: newStoreImg,
      groupImg: newGroupImg,
      province: pname,
      city: cityname,
      area: adname,
      communityAddress: address,
      lng,
      lat,
    };

    if (!checkForm(param)) return;

    dispatch({
      type: actionMap.update,
      payload: param,
      callback: () => {
        load();
        message.success('保存成功');
      },
    });
  };

  const renderStep1 = () => {
    return (
      <>
        <Card
          className={`${styles.cardItem}`}
          style={{ borderBottom: 'none', borderTop: 'none' }}
          title="团长信息"
        >
          <Form.Item className={styles.detailRule} label="团长姓名" name="contactName">
            <Input placeholder="请输入团长姓名" maxLength={20} />
          </Form.Item>
          <Form.Item className={styles.detailRule} label="团长联系电话" name="contactMobile">
            <Input type="tel" placeholder="请输入团长联系电话" maxLength={11} />
          </Form.Item>
          <Form.Item
            className={`${styles.detailRule} ${styles.uploadItem}`}
            label="微信群截图"
            name="groupImg"
          >
            <Uploader
              className="dib"
              onChange={(res) => {
                setGroupImg(res); /* res:所有文件列表； doneList：所有上传完成并且成功的文件列表 */
              }}
              fileList={groupImg}
              size="3"
              limit={3}
              space="10px"
            />
          </Form.Item>
        </Card>
        <Card
          className={styles.cardItem}
          style={{ borderTop: 'none', borderBottom: 'none' }}
          title="自提点信息"
        >
          <Form.Item className={styles.detailRule} label="自提点名称" name="name">
            <Input placeholder="请输入自提点名称" maxLength={100} />
          </Form.Item>
          <Form.Item className={styles.detailRule} label="自提点类型" name="type">
            <Select placeholder="请选择自提点类型">
              {pickupTypeList.map((i) => (
                <Option key={i.value} value={i.value}>
                  {i.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className={`${styles.detailRule} ${styles.uploadItem}`}
            label="自提点（门头）照片"
            name="storeImg"
          >
            <Uploader
              className="dib"
              onChange={(res) => {
                setStoreImg(res); /* res:所有文件列表； doneList：所有上传完成并且成功的文件列表 */
              }}
              fileList={storeImg}
              size="1"
              limit={1}
              space="10px"
            />
          </Form.Item>
          <Form.Item className={styles.detailRule} label="收货地址" name="addressInfo">
            <AMapPOI addressValue={initAddressInfo} />
          </Form.Item>
          <Form.Item className={styles.detailRule} label="详细地址" name="detail">
            <Input placeholder="请输入详细地址" maxLength={200} />
          </Form.Item>
        </Card>
      </>
    );
  };
  const renderStep2 = () => {
    return (
      <Card
        className={`${styles.cardItem}`}
        style={{ borderBottom: 'none', borderTop: 'none' }}
        title="主体/收款账户"
      >
        <Form.Item className={styles.detailRule} label="身份证姓名" name="contactName">
          <Input placeholder="请输入身份证姓名" maxLength={20} />
        </Form.Item>
        <Form.Item className={styles.detailRule} label="身份证号码" name="contactMobile">
          <Input type="tel" placeholder="请输入身份证号码" maxLength={23} />
        </Form.Item>
      </Card>
    );
  };
  const renderBtn = () => {
    const type = getType();
    return (
      <Card style={{ borderTop: 'none' }}>
        <Form.Item {...tailFormItemLayout}>
          {type === 'add' && current === 0 ? (
            <>
              <Button size="large" onClick={() => history.goBack()} className="mr30">
                返回
              </Button>
              <Button size="large" type="primary" onClick={() => next()}>
                保存并下一步
              </Button>
            </>
          ) : null}
          {type === 'add' && current === 1 ? (
            <>
              <Button size="large" onClick={() => prev()} className="mr30">
                返回
              </Button>
              <Button size="large" type="primary" onClick={() => handleSave()}>
                确认保存
              </Button>
            </>
          ) : null}
          {type === 'edit' ? (
            <>
              <Button size="large" onClick={() => history.goBack()} className="mr30">
                返回
              </Button>
              <Button size="large" type="primary" onClick={() => handleSave()}>
                确认保存
              </Button>
            </>
          ) : null}
        </Form.Item>
      </Card>
    );
  };

  return (
    <PageHeaderWrapper title={getType() === 'edit' ? '编辑团长信息' : '创建团长'}>
      {getType() === 'add' ? (
        <Card style={{ borderBottom: 'none' }}>
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </Card>
      ) : null}
      <Form {...formItemLayout} form={formRef}>
        {current === 0 ? renderStep1() : renderStep2()}
        {renderBtn()}
      </Form>
    </PageHeaderWrapper>
  );
};

export default connect(({ groupHeader }) => ({
  groupHeader,
}))(Statistics);
