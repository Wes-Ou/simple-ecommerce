import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import 'antd/dist/reset.css'; // 引入Ant Design样式

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import CategoryListPage from './pages/CategoryListPage';
import CategoryProductPage from './pages/CategoryProductPage';  // 导入新的商品展示页面

const { Sider, Content } = Layout;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 从 localStorage 获取 token 判断是否已经登录
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);  // 如果存在 token，则表示用户已登录
    }
  }, []);

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    // 退出后跳转到登录页
    window.location.href = '/login'; // 通过修改 window.location 跳转到登录页
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {/* 只有在用户登录后才显示 Sider */}
        {isAuthenticated && (
          <Sider
            width={200}
            className="site-layout-background"
            style={{
              position: 'fixed', // 固定左侧
              height: '100vh', // 使侧边栏的高度与视口一致
              top: 0, // 顶部对齐
              left: 0, // 左对齐
              zIndex: 1000, // 确保Sider不被其他内容覆盖
            }}
          >
            <Menu
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
              defaultSelectedKeys={['1']}
            >
              <Menu.Item key="1">
                <Link to="/products">商品管理</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/categories">分类管理</Link>
              </Menu.Item>
              {/* 添加商品展示菜单项 */}
              <Menu.Item key="3">
                <Link to="/category-product">商品展示</Link>
              </Menu.Item>
            </Menu>
            {/* 退出按钮 */}
            <Button
              type="primary"
              danger
              onClick={handleLogout}
              style={{
                position: 'absolute',
                bottom: '20px',
                width: '100%',
              }}
            >
              退出登录
            </Button>
          </Sider>
        )}

        <Layout style={{ marginLeft: isAuthenticated ? 200 : 0, padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 使用 PrivateRoute 来保护需要登录的页面 */}
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
              {/* 添加商品展示页面路由 */}
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

              {/* 默认路由 */}
              <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
