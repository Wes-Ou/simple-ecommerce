import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // 如果没有 token，重定向到登录页面
    return <Navigate to="/login" />;
  }

  // 否则，渲染子组件
  return children;
};

export default PrivateRoute;
