import { Button } from 'antd';
import React from 'react';
import { redirect, useNavigate } from 'react-router';
import { router } from '../../main';

type LoginProps = {};

const Login: React.FC<LoginProps> = props => {
  const {} = props;

  const navigate = useNavigate();

  function handleLogin() {
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        username: 'admin',
      })
    );
    setTimeout(() => {
      router.routes[1].children?.push({
        path: '/projects',
        element: <div>项目列表 需要权限</div>,
      });
    }, 1000);
    navigate('/');
  }

  return (
    <>
      <p>登录页</p>
      <Button type="primary" onClick={handleLogin}>
        登录
      </Button>
    </>
  );
};

Login.displayName = 'Login';

export default Login;
