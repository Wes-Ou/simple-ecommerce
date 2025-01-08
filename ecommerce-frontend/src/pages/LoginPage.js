import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      navigate('/category-product');
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username: values.username,
        password: values.password,
      });
      
      const { access_token, userId } = response.data;

      if (access_token && userId) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('userId', userId);
        
        setIsAuthenticated(true);
        
        message.success('登录成功');
        navigate('/category-product');
      } else {
        message.error('未获取到有效的用户信息');
      }
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
      console.error('Login error:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ width: 300, margin: '100px auto' }}>
      <h2>登录</h2>
      <Form onFinish={onFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="link"
            onClick={() => navigate('/register')}
            style={{ width: '100%' }}>
            注册账号
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
