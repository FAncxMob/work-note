import React, { useEffect } from 'react';
import { connect } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight = (props) => {
  const { theme, layout, supplierInfo, dispatch } = props;
  let className = styles.right;
  useEffect(() => {
    // const userInfo = window.User.getUserInfo();
    // if (userInfo.id) {
    //   // 获取供应商营业信息
    //   dispatch({
    //     type: 'supplierInfo/getSupplierInfo',
    //     payload: { id: userInfo.id },
    //   });
    // }
  }, []);

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <div className={className}>
      <Avatar />
    </div>
  );
};

export default connect(({ settings, supplierInfo }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  supplierInfo,
}))(GlobalHeaderRight);
