import React from 'react';
import { history, connect } from 'umi';
import { Form, Checkbox, Modal, message, Button, Card } from 'antd';
import AMapPOI from '@/components/AMap/AMapPOI';
import { mobilePattern } from '@/utils/verificationRules';
import CustomerForm from '@/components/CustomerForm';
import shop from '@/customizeModel/Shop/Shop';
import Uploader from '@/components/Uploader';
import PlatformRules from '../components/PlatformRules';
import ServiceAgreement from '../components/ServiceAgreement';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const tailFormItemLayout = {
  wrapperCol: { offset: 2, span: 16 },
};

class CreateShop extends React.Component {
  formRef = React.createRef();

  state = {
    isRead: false,
    initialValues: {},
    submitting: false,
    shopLogo: [],
  };

  componentDidMount() {
    this.load();
  }

  showAgreement = (type) => {
    Modal.info({
      icon: '',
      title: (
        <div className="text-center mb20 fz24">
          {type === '1' ? '火品平台规则' : '火品服务协议'}
        </div>
      ),
      maskClosable: true,
      style: { top: 50 },
      width: '80%',
      content: type === '1' ? <PlatformRules /> : <ServiceAgreement />,
    });
  };

  handleCreateShop = async () => {
    this.formRef.current.validateFields().then(async (res) => {
      try {
        if (!this.state.shopLogo[0]) {
          message.warning('请上传店铺Logo');
          return;
        }
        if (!this.state.isRead) {
          message.warning('需先同意入驻协议');
          return;
        }

        const {
          pname,
          cityname,
          adname,
          address,
          location: { lat, lng },
        } = { ...this.state.initAddressInfo, ...res.addressInfo };

        const { addressInfo, ...ret } = res;
        const {
          shopLogo: [shopLogo],
        } = this.state;
        const shopInfo = {
          isLocalEnabled: 0, // 先写死
          isGlobalEnabled: 0, // 先写死
          isGroup: 1, // 先写死
          ...ret,
          shopLogo: typeof shopLogo === 'object' ? shopLogo.filePath : shopLogo,
          address,
          area: adname,
          lat,
          lng,
          city: cityname,
          province: pname,
          tags: '',
        };

        await shop.create(shopInfo);
        history.replace('/shop/index');
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

  async load() {
    try {
      if (await shop.isCreateShop()) {
        history.replace('/shop/index');
        return;
      }

      const { avatarUrl, nickName, phoneNum } = window.User.getUserInfo() || {};
      this.formRef.current.setFieldsValue({
        name: `${nickName}的小店`,
        contactMobile: phoneNum,
        identity: 1,
      });
      this.setState({
        shopLogo: [avatarUrl],
      });
    } catch (error) {
      console.error(error);
    }
  }

  renderSubmit = () => {
    return (
      <div className="w100p df flex-column align-start mt20">
        <Checkbox
          checked={this.state.isRead}
          onChange={(e) => this.setState({ isRead: e.target.checked })}
        >
          我已阅读并同意《 <a onClick={() => this.showAgreement('1')}>平台规则</a> 》 《{' '}
          <a onClick={() => this.showAgreement('2')}>服务协议</a> 》
        </Checkbox>

        <Button
          size="large"
          type="primary"
          loading={this.state.submitting}
          onClick={() => this.handleCreateShop()}
          className="w100p margin-auto mt10"
        >
          立即开店
        </Button>
      </div>
    );
  };

  renderUploadImg = (type) => {
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
        />
      </div>
      // <>
      //   <Upload
      //     action={uploadUrl}
      //     listType="picture-card"
      //     data={{ appId: 'S' }}
      //     headers={signHeader()}
      //     showUploadList={false}
      //     beforeUpload={(file) => beforeUpload(file, { type: 'image' })}
      //     onSuccess={(e) => this.handleSuccess(e, type)}
      //   >
      //     <div style={imgStyle}>
      //       {currentImg ? (
      //         <img src={UFF.getProductImage(currentImg)} alt="currentImg" className="w100p h100p" />
      //       ) : (
      //         <div className="df align-center justify-center flex-column w100p h100p">
      //           <FileImageOutlined className="fz30" />
      //           <div className="mt10">上传图片</div>
      //         </div>
      //       )}
      //     </div>
      //   </Upload>
      //   {hintText ? <p className="text-info">{hintText}</p> : null}
      // </>
    );
  };

  renderForm = () => {
    const formList4Create = [
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
        name: 'shopLogo',
        label: '店铺Logo',
        formItemOption: {
          className: styles.detailRule,
        },
        el: <>{this.renderUploadImg('shopLogo')}</>,
        // rule: [{ required: true, message: '店铺Logo不能为空!' }],
      },
      {
        label: '店铺地址',
        name: 'addressInfo',
        el: <AMapPOI addressValue={this.state.initAddressInfo} />,
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
      {
        type: 'radio',
        name: 'identity',
        label: '选择身份',
        formItemOption: {
          className: 'mb20',
        },
        rule: [{ required: true, message: '请选择身份!' }],
        elOptions: {
          options: [
            { value: 1, label: '团长' },
            { value: 2, label: '商家' },
          ],
          buttonStyle: 'solid',
        },
      },
    ];
    return (
      <CustomerForm
        formItemLayout={formItemLayout}
        tailFormItemLayout={tailFormItemLayout}
        layout={formItemLayout}
        FormList={formList4Create}
        hideButton
        formRef={this.formRef}
        extra={<Form.Item className="text-center justify-center">{this.renderSubmit()}</Form.Item>}
      />
    );
  };

  render() {
    return (
      <div className="w100p df justify-center">
        <Card title={<p className="text-center mb0 fz20">开店</p>} className="w40p bdr5">
          <div className="margin-auto w100p">{this.renderForm()}</div>
        </Card>
      </div>
    );
  }
}

export default connect(({ login }) => ({
  userLogin: login,
}))(CreateShop);
