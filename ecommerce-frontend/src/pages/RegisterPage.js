import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/auth/register', {
        username: values.username,
        password: values.password,
        email: values.email,
      });
      message.success('注册成功');
      navigate('/login');
    } catch (error) {
      message.error('注册失败');
    }
    setLoading(false);
  };

  return (
    <div style={{ width: 300, margin: '100px auto' }}>
      <h2>注册</h2>
      <Form onFinish={onFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: '请输入邮箱' }]}
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
            注册
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="link"
            onClick={() => navigate('/login')}
            style={{ width: '100%' }}
          >
            已有账号? 登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
