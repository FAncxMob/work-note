import React, { useEffect } from 'react';
import { history, connect } from 'umi';
import { Spin, Modal, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import config from '@/utils/config';
import styles from './style.less';

const { confirm } = Modal;

const Transit = (props) => {
  const {
    location: {
      query: { code, jump },
    },
    dispatch,
  } = props;

  const showModal = (unionId) => {
    confirm({
      title: '您暂未绑定手机号',
      icon: <ExclamationCircleOutlined />,
      content: '请先绑定手机号',
      okText: '去绑定',
      cancelText: '返回登录',
      onOk() {
        history.replace(`/user/register?unionId=${unionId}`);
      },
      onCancel() {
        history.replace('/user/login');
      },
    });
  };

  const load = async () => {
    const { appId } = config;
    dispatch({
      type: 'login/loginByCode',
      payload: { code, appId },
      callback: async (res) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { sub_code, sub_msg, token, unionId, role } = res;
        if (sub_code) return notification.error({ message: sub_msg });
        if (!token || !role) return showModal(unionId);
        await window.User.setUserInfo(res);
        if (jump && jump.indexOf('register') !== -1) return history.replace('/shop/index'); // 扫码去注册但是已经有注册账号，就直接按登录处理
        return history.replace(jump || '/info/inductedInfo'); // 统一到 供应商信息填写页 去判断是否完成资质审核
      },
    });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className={styles.spinWarp}>
      <Spin className={styles.spin} />
    </div>
  );
};

export default connect(({ login }) => ({
  userLogin: login,
}))(Transit);
