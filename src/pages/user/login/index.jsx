import React, { useState } from 'react';
import { history, connect } from 'umi';
import { Form, notification } from 'antd';
import { WechatOutlined } from '@ant-design/icons';
import config from '@/utils/config';
import shop from '@/customizeModel/Shop/Shop';
import LoginForm from './components/Login';

import styles from './style.less';

const { Captcha, Mobile, Submit } = LoginForm;

const { qs } = require('@/utils/utils');

const Login = (props) => {
  const [timeDown, setTimeDown] = useState(false);
  const { loading, captchaLoading, dispatch } = props;
  const [form] = Form.useForm();
  const { validateFields } = form;

  const handleGetCaptcha = () => {
    validateFields(['mobile'])
      .then(async (values) => {
        dispatch({
          type: 'login/getCaptcha',
          payload: { ...values, deviceid: window.User.getDeviceId() },
          callback: () => setTimeDown(true),
        });
      })
      .catch(() => {
        notification.error({ message: '获取验证码失败' });
      });
  };

  const handleLoginByWx = (jump) => {
    const { appId: appid, redirectHost } = config;
    const { protocol, host } = window.location;
    const redirectUrl = `${protocol}//${redirectHost || host}/user/transit`;
    const jumpUrl = jump ? `?jump=${jump}` : '';
    const href = qs('https://open.weixin.qq.com/connect/qrconnect', {
      appid,
      scope: 'snsapi_login,snsapi_userinfo',
      redirect_uri: `${encodeURIComponent(redirectUrl + jumpUrl)}#wechat_redirect`,
    });
    window.location.href = href;
  };

  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/loginByMobile',
      payload: { ...values, deviceId: window.User.getDeviceId() },
      callback: async (res) => {
        const { sub_code: subCode, sub_msg: subMsg } = res;
        if (subCode) return notification.error({ message: subMsg });
        await window.User.setUserInfo(res);
        const isCreateShop = await shop.isCreateShop();
        return isCreateShop ? history.replace('/shop/index') : history.replace('/createShop/index');
      },
    });
  };

  return (
    <div className={styles.main}>
      <LoginForm form={form} onSubmit={handleSubmit}>
        <Mobile
          name="mobile"
          placeholder="手机号"
          rules={[
            {
              required: true,
              message: '请输入手机号！',
            },
            {
              pattern: /^1\d{10}$/,
              message: '手机号格式错误！',
            },
          ]}
        />
        <Captcha
          name="smsCode"
          placeholder="验证码"
          countDown={60}
          onGetCaptcha={handleGetCaptcha}
          showTimeDown={timeDown}
          stopCountDown={() => setTimeDown(false)}
          getCaptchaButtonText=""
          getCaptchaSecondText="秒"
          loading={captchaLoading}
          rules={[
            {
              required: true,
              message: '请输入验证码！',
            },
            {
              max: 6,
              min: 6,
              message: '请输入6位验证码！',
            },
          ]}
        />
        <Submit loading={loading}>登录</Submit>
        <div className="df justify-between">
          <div className="df align-center">
            <span>微信扫码登录</span>
            <WechatOutlined className={styles.icon} onClick={() => handleLoginByWx()} />
          </div>
        </div>
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  loading: loading.effects['login/loginByMobile'],
  captchaLoading: loading.effects['login/getCaptcha'],
}))(Login);
