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
      if (error.response.data.message) {
        message.error(error.response.data.message);
      } else {
      message.error('注册失败');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ width: 400, height: 400, margin: '100px auto' }}>
      <h1 style={{ fontSize: 48, textAlign: 'center' }}>注册</h1>
      <Form onFinish={onFinish}>
        <Form.Item
          label="用户名"
          name="username"
          labelCol={{ style: { fontSize: '32px' }}}
          rules={[{ required: true, message: '请输入用户名' }]}
        >
        <Input style={{ fontSize: '32px' }}/>
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          labelCol={{ style: { fontSize: '32px' }}}
          rules={[{ required: true, message: '请输入邮箱' }]}
        >
        <Input style={{ fontSize: '32px' }}/>
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          labelCol={{ style: { fontSize: '32px' }}}
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password style={{ fontSize: '32px' }}/>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" block loading={loading} style={{ width: '80%', fontSize: '32px' }}>
            注册
          </Button>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button
            type="link"
            onClick={() => navigate('/login')}
            style={{ width: '80%', fontSize: '32px' }}          >
            已有账号? 登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
