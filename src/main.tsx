import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from 'react-router-dom';
import PageLayout from './layout/PageLayout.tsx';
import Login from './pages/login/Login.tsx';
import Home from './pages/home/Home.tsx';
import { message } from 'antd';
import './style/index.less';

const redirectIfUser = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    message.warning('请登录');
    return redirect('/login');
  }

  return null;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <PageLayout />,
    loader: redirectIfUser,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}></RouterProvider>
);
