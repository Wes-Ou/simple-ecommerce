import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import api from '../services/api';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/category');
      setCategories(response.data);
    } catch (error) {
      message.error('获取分类失败');
    }
    setLoading(false);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/category/${id}`);
      message.success('删除成功');
      fetchCategories();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOk = async (values) => {
    const { name, parentId } = values;
    try {
      if (editCategory) {
        await api.patch(`/category/${editCategory.id}`, {
          name,
          parentId,
        });
        message.success('分类更新成功');
      } else {
        await api.post('/category', {
          name,
          parentId,
        });
        message.success('分类创建成功');
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      title: '父分类',
      dataIndex: 'parent',
      render: (parent) => parent?.name || '无',
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record)} type="link">
            编辑
          </Button>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setEditCategory(null);
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        添加分类
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editCategory ? '编辑分类' : '添加分类'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editCategory || {}}
          onFinish={handleOk}
          layout="vertical"
        >
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="父分类" name="parentId">
            <Input type="number" placeholder="输入父分类ID (可选)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editCategory ? '更新分类' : '创建分类'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryListPage;
