import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username: values.username,
        password: values.password,
      });
      localStorage.setItem('token', response.data.access_token);
      message.success('登录成功');
      navigate('/products'); // 这里使用 navigate('/products') 跳转到产品页面
    } catch (error) {
      message.error('登录失败');
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
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form.Item>
        {/* 注册页面跳转按钮 */}
        <Form.Item>
          <Button
            type="link"
            onClick={() => navigate('/register')} // 点击时跳转到注册页面
            style={{ width: '100%' }}
          >
            注册账号
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
