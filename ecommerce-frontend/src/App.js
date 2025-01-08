import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import CategoryListPage from './pages/CategoryListPage';
import CategoryProductPage from './pages/CategoryProductPage';

const { Sider, Content, Header } = Layout;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <Layout className="layout">
        <Header className="header">
          私人电商管理系统
        </Header>

        {isAuthenticated && (
          <Sider className="sider" width={200}>
            <Menu
              mode="inline"
              className="menu"
              defaultSelectedKeys={['1']}
            >
              <Menu.Item key="1">
                <Link to="/category-product">商品展示</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/products">商品管理</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/categories">分类管理</Link>
              </Menu.Item>
            </Menu>
            <Button
              type="primary"
              danger
              onClick={handleLogout}
              className="logout-button"
            >
              退出登录
            </Button>
          </Sider>
        )}

        <Layout className={isAuthenticated ? "layout-with-sider" : ""}>
          <Content className="content">
            <Routes>
              <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/products"
                element={
                  isAuthenticated ? (
                    <ProductListPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/categories"
                element={
                  isAuthenticated ? (
                    <CategoryListPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/category-product"
                element={
                  isAuthenticated ? (
                    <CategoryProductPage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
