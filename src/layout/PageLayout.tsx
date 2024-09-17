import { Button, Space } from 'antd';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

type PageLayoutProps = {};

const PageLayout: React.FC<PageLayoutProps> = props => {
  const {} = props;

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('user');
    navigate('/login');
  }

  const user = JSON.parse(localStorage.getItem('user') || '');

  useEffect(() => {
    navigate('/home');
  }, []);

  return (
    <>
      <Space>
        <p>layout</p>
        <p>hello {user?.username}</p>
        <Button type="dashed" onClick={handleLogout}>
          退出登录
        </Button>
      </Space>
      <main
        className="content"
        style={{ border: '1px solid black', padding: '20px' }}
      >
        这是内容区
        <Link to="/home">Home</Link>
        <Link to="/projects">Projects</Link>
        <Outlet />
      </main>
    </>
  );
};

PageLayout.displayName = 'PageLayout';

export default PageLayout;
