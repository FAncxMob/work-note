import React from 'react';
import { connect, history } from 'umi';
import { Form, Avatar, Card, message } from 'antd';
import LoginForm from './components/Login';

import styles from './style.less';

const { Meta } = Card;

const { Password, Submit } = LoginForm;

const ResetPassword = (props) => {
  const [form] = Form.useForm();
  const { validateFields, getFieldValue } = form;
  const { avatarUrl, nickName, phoneNum, unionId } = window.User.getUserInfo();
  const { submitting } = props;
  const handleSubmit = ({ pwd }) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/resetPwd',
      payload: { pwd, unionId },
      callback: () => {
        message.success('密码修改成功！');
        history.replace('/user/login');
      },
    });
  };

  const handleChangePassword = (e) => {
    e.persist();
    if (getFieldValue('rePwd')) validateFields(['rePwd']);
  };

  const rePasswordValidator = async (rule, value) => {
    const password = getFieldValue('pwd');
    if (value && password && password !== value) throw new Error('两次密码不一致');
  };

  return (
    <div className={styles.main}>
      <LoginForm form={form} onSubmit={handleSubmit}>
        <Card className="bgc-upload mb20">
          <Meta avatar={<Avatar src={avatarUrl} />} title={nickName} description={phoneNum} />
        </Card>
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
        <Submit loading={submitting}>确定</Submit>
      </LoginForm>
    </div>
  );
};

export default connect(({ login }) => ({
  userLogin: login,
}))(ResetPassword);
