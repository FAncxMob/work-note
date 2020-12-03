import React, { useState, useEffect } from 'react';
import { Link, history, connect } from 'umi';
import { Form, Checkbox, Modal, message } from 'antd';
import LoginForm from './components/Login';
import Agreement from './components/Login/Agreement';

import styles from './style.less';

const { Captcha, Mobile, Password, Submit } = LoginForm;

const Register = (props) => {
  const {
    location: {
      query: { unionId },
    },
    dispatch,
  } = props;
  const [form] = Form.useForm();
  const { validateFields, getFieldValue } = form;
  const [isRead, setIsRead] = useState(false);
  const [timeDown, setTimeDown] = useState(false);
  const { submitting } = props;
  const handleSubmit = (values) => {
    if (!isRead) return message.warning('需先同意入驻协议');
    return dispatch({
      type: 'login/scanBind',
      payload: {
        ...values,
        deviceid: window.User.getDeviceId(),
        unionId: unionId || window.User.getUserInfo().unionId,
      },
      callback: async (res) => {
        await window.User.setUserInfo(res);
        message.success('注册成功');
        history.replace('/info/inductedInfo');
      },
    });
  };

  const handleGetCaptcha = () => {
    validateFields(['mobile'])
      .then(async (values) => {
        dispatch({
          type: 'login/getCaptcha',
          payload: { ...values, deviceid: window.User.getDeviceId() },
          callback: () => setTimeDown(true),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStopCountDown = () => setTimeDown(false);

  const handleChangePassword = (e) => {
    e.persist();
    if (getFieldValue('rePwd')) validateFields(['rePwd']);
  };

  const rePasswordValidator = async (rule, value) => {
    const pwd = getFieldValue('pwd');
    if (value && pwd && pwd !== value) throw new Error('两次密码不一致');
  };

  const showAgreement = () => {
    Modal.info({
      icon: '',
      title: <div className="text-center mb20 fz24">火品平台入驻协议（POP）</div>,
      maskClosable: true,
      style: { top: 50 },
      width: '80%',
      content: <Agreement />,
    });
  };

  useEffect(() => {}, []);

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
          stopCountDown={handleStopCountDown}
          getCaptchaButtonText=""
          getCaptchaSecondText="秒"
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
        <Password
          name="pwd"
          placeholder="密码，至少6位，区分大小写"
          onChange={handleChangePassword}
          rules={[
            {
              required: true,
              message: '请设置密码！',
            },
            {
              max: 24,
              min: 6,
              message: '请输入6-24位密码！',
            },
          ]}
        />
        <Password
          name="rePwd"
          placeholder="确认密码"
          rules={[
            {
              required: true,
              message: '请确认密码！',
            },
            {
              validator: rePasswordValidator,
            },
          ]}
        />
        <Checkbox checked={isRead} onChange={(e) => setIsRead(e.target.checked)}>
          我已阅读并同意《 <a onClick={showAgreement}>火品平台入驻协议</a> 》
        </Checkbox>
        <Submit loading={submitting}>注册</Submit>
        <Link to="/user/login" className="text-center db">
          使用已有帐号登录
        </Link>
      </LoginForm>
    </div>
  );
};

export default connect(({ login }) => ({
  userLogin: login,
}))(Register);
