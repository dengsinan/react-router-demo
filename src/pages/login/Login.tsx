import { Button } from 'antd';
import React from 'react';
import { redirect, useNavigate } from 'react-router';

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
