import React, { useState, useEffect } from 'react';
import { history, connect } from 'umi';
import { Form, message, Button, Card, Tag } from 'antd';
import AMapPOI from '@/components/AMap/AMapPOI';
import { mobilePattern } from '@/utils/verificationRules';
import CustomerForm from '@/components/CustomerForm';
import { FormOutlined } from '@ant-design/icons';
import shop from '@/customizeModel/Shop/Shop';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Uploader from '@/components/Uploader';
import ChooseTags from '../components/ChooseTags';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const tailFormItemLayout = {
  wrapperCol: { offset: 2, span: 16 },
};

class EditShop extends React.Component {
  formRef = React.createRef();

  state = {
    isRead: false,
    submitting: false,
    shopLogo: [],
    weChatQrCode: [],
    backImages: [],
    initAddressInfo: {},
    shopInfo: {},
    selectedTags: [],
  };

  componentDidMount() {
    this.load();
  }

  load = async () => {
    try {
      const shopInfo = (await shop.getShopInfo()) || {};
      this.formRef.current.setFieldsValue({ ...shopInfo, addressInfo: {} });
      this.setState({
        initAddressInfo: {
          location: { lat: shopInfo.lat, lng: shopInfo.lng },
          pname: shopInfo.province,
          adname: shopInfo.area,
          cityname: shopInfo.city,
          address: shopInfo.address,
        },
        shopLogo: shopInfo.shopLogo ? [shopInfo.shopLogo] : [],
        weChatQrCode: shopInfo.weChatQrCode ? [shopInfo.weChatQrCode] : [],
        backImages: shopInfo.backImages ? [shopInfo.backImages] : [],
        shopInfo,
        selectedTags: (shopInfo.tags && shopInfo.tags.split(',')) || [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleCreateShop = async () => {
    this.formRef.current.validateFields().then(async (res) => {
      try {
        if (!this.state.shopLogo[0]) {
          message.warning('请上传店铺Logo');
          return;
        }

        const {
          pname,
          cityname,
          adname,
          address,
          location: { lat, lng },
        } = { ...this.state.initAddressInfo, ...res.addressInfo };
        const {
          shopLogo: [shopLogo],
          weChatQrCode: [weChatQrCode],
          backImages: [backImages],
        } = this.state;

        const { addressInfo, ...ret } = res;

        const shopInfo = {
          isLocalEnabled: 0, // 先写死
          isGlobalEnabled: 0, // 先写死
          isGroup: 1, // 先写死
          ...ret,
          shopLogo: typeof shopLogo === 'object' ? shopLogo.filePath : shopLogo,
          weChatQrCode: typeof weChatQrCode === 'object' ? weChatQrCode.filePath : weChatQrCode,
          backImages: typeof backImages === 'object' ? backImages.filePath : backImages,
          address,
          area: adname,
          lat,
          lng,
          city: cityname,
          province: pname,
          tags: this.state.selectedTags.join(','),
        };

        await shop.edit(shopInfo);
        history.replace('/shop/index');
        message.success('保存成功');
      } catch (error) {
        console.error(error);
      }
    });
  };

  handleSuccess = (res, type) => {
    try {
      if (res.sub_code === 'ok') {
        const data = {};
        data[type] = res.data.filePath;
        this.setState(data);
      } else {
        message.error('上传图片失败！');
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderSubmit = () => {
    return (
      <div className="w100p df flex-column align-start mt20">
        <Button
          size="large"
          type="primary"
          loading={this.state.submitting}
          onClick={() => this.handleCreateShop()}
          className="w50p margin-auto mt10"
        >
          保存
        </Button>
      </div>
    );
  };

  renderUploadImg = (type, hintText, imgStyle = {}) => {
    const currentImg = this.state[type];
    return (
      <div className="ml-10">
        <Uploader
          className="dib"
          onChange={(res) => {
            const data = {};
            data[type] = res;
            this.setState(data);
          }}
          fileList={currentImg}
          size="1"
          limit={1}
          space="10px"
          width={imgStyle.width}
          height={imgStyle.height}
        />
        {hintText ? <p className="text-info">{hintText}</p> : null}
      </div>
    );
  };

  showChooseTag = () => {
    ChooseTags.open({
      onSelect: (select) => {
        this.setState({ selectedTags: select });
      },
      classes: this.state.selectedTags,
    });
  };

  renderForm = () => {
    const {
      initAddressInfo,
      shopInfo: { authAuditStatus, secondNames },
      selectedTags,
    } = this.state;

    const formList4Edit = [
      {
        type: 'input',
        name: 'name',
        label: '店铺名称',
        elOptions: {
          maxLength: 20,
          placeholder: '请输入店铺名称（20字以内）',
        },
        rule: [{ required: true, whitespace: true, message: '店铺名称不能为空!' }],
      },
      {
        type: 'textArea',
        name: 'description',
        label: '店铺描述',
        elOptions: {
          maxLength: 200,
          rows: 4,
          placeholder: '请输入店铺描述',
        },
      },
      {
        type: 'input',
        name: 'contactMobile',
        label: '联系电话',
        elOptions: {
          placeholder: '请输入联系电话',
        },
        rule: [
          { required: true, message: '店铺联系人电话不能为空!' },
          { pattern: mobilePattern, message: '请输入正确的手机号!' },
        ],
      },
      {
        name: 'weChatQrCode',
        label: '微信二维码',
        el: (
          <>
            {this.renderUploadImg('weChatQrCode', '', {
              width: '110px',
              height: '110px',
            })}
          </>
        ),
      },
      {
        name: 'shopLogo',
        label: '店铺Logo',
        formItemOption: {
          className: styles.detailRule,
        },
        el: (
          <>
            {this.renderUploadImg('shopLogo', '', {
              width: '110px',
              height: '110px',
            })}
          </>
        ),
      },
      {
        name: 'backImages',
        label: '店铺背景图',
        el: (
          <>
            {this.renderUploadImg('backImages', '建议上传尺寸750*270 ，大小5M以内', {
              width: '438px',
              height: '160px',
            })}
          </>
        ),
      },
      {
        label: '店铺地址',
        name: 'addressInfo',
        el: <AMapPOI addressValue={initAddressInfo} />,
        rule: [{ required: true, message: '店铺地址不能为空!' }],
      },
      {
        type: 'input',
        name: 'detail',
        label: '详细地址',
        elOptions: {
          maxLength: 50,
          placeholder: '请输入店铺详细地址（50字以内）',
        },
        rule: [{ required: true, whitespace: true, message: '店铺详细地址不能为空!' }],
      },
    ];
    if (authAuditStatus === 3) {
      const newSecondNames = secondNames.split(',');

      formList4Edit.splice(
        2,
        0,
        {
          name: 'secondNames',
          label: '经营类目',
          el: (
            <>
              {newSecondNames.map((v, i) => (
                <Tag color="blue" key={i}>
                  {v}
                </Tag>
              ))}
            </>
          ),
        },
        {
          name: 'tags',
          label: '店铺标签',
          el: (
            <>
              {selectedTags.length ? (
                <>
                  {selectedTags.map((name, i) => (
                    <Tag color="blue" key={i}>
                      {name}
                    </Tag>
                  ))}
                  <FormOutlined onClick={this.showChooseTag} />
                </>
              ) : (
                <Button onClick={this.showChooseTag} type="primary">
                  选择店铺标签
                </Button>
              )}
            </>
          ),
        },
      );
    }
    return (
      <CustomerForm
        formItemLayout={formItemLayout}
        tailFormItemLayout={tailFormItemLayout}
        layout={formItemLayout}
        FormList={formList4Edit}
        hideButton
        formRef={this.formRef}
        extra={<Form.Item className="text-center justify-center">{this.renderSubmit()}</Form.Item>}
      />
    );
  };

  render() {
    return (
      <PageHeaderWrapper title="编辑店铺信息">
        <Card className="margin-auto w100p bgc-white">{this.renderForm()}</Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ login }) => ({
  userLogin: login,
}))(EditShop);
