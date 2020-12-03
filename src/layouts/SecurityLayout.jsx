import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect } from 'umi';
import { stringify } from 'querystring';
import shop from '@/customizeModel/Shop/Shop';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  async componentDidMount() {
    const { dispatch } = this.props;

    const hasShop = await shop.isCreateShop();
    this.setState({
      isReady: true,
      hasShop,
    });

    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isReady, hasShop } = this.state;
    const { children, loading, currentUser } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    const isLogin = currentUser && currentUser.token;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    if (isLogin && !hasShop && window.location.pathname !== '/createShop/index') {
      return <Redirect to="/createShop/index" />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: window.User.getUserInfo(),
  loading: loading.models.user,
}))(SecurityLayout);
