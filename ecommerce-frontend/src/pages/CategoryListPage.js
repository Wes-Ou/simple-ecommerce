import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, Select, message } from 'antd';
import api from '../services/api';
import './CategoryListPage.css';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [userId, setUserId] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    const parsedUserId = currentUserId ? Number(currentUserId) : null;

    if (parsedUserId === null || isNaN(parsedUserId)) {
      message.error('未找到有效的用户信息');
      return;
    }

    setUserId(parsedUserId);
    fetchTopLevelCategories(parsedUserId);
    fetchAllCategories(parsedUserId);
  }, []);

  const fetchTopLevelCategories = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get('/category', {
        params: { userId },
      });
      setCategories(response.data);
    } catch (error) {
      message.error('获取顶级分类失败');
    }
    setLoading(false);
  };

  const fetchAllCategories = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get('/category/all', {
        params: { userId },
      });
      setAllCategories(response.data);
    } catch (error) {
      message.error('获取所有分类失败');
    }
    setLoading(false);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/category/${id}`);
      message.success('删除成功');
      fetchTopLevelCategories(userId);
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOk = async (values) => {
    const { name, parentId } = values;

    if (!userId) {
      message.error('未找到用户信息');
      return;
    }

    try {
      if (editCategory) {
        await api.patch(`/category/${editCategory.id}`, {
          name,
          parentId,
          userId,
        });
        message.success('分类更新成功');
      } else {
        await api.post('/category', {
          name,
          parentId,
          userId,
        });
        message.success('分类创建成功');
      }
      setIsModalOpen(false);
      fetchTopLevelCategories(userId);
      fetchAllCategories(userId);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getChildren = (parentId) => {
    return allCategories.filter((category) => category.parentId === parentId);
  };

  const expandedRowRender = (record) => {
    const children = getChildren(record.id);

    if (children.length === 0) {
      return null;
    }

    return (
      <Table
        columns={[
          { title: '子分类名称', dataIndex: 'name' },
          { title: '创建时间', dataIndex: 'createdAt', render: (text) => new Date(text).toLocaleString() },
          { title: '更新时间', dataIndex: 'updatedAt', render: (text) => new Date(text).toLocaleString() },
          {
            title: '操作',
            render: (text, subRecord) => (
              <span>
                <Button className="edit-btn" onClick={() => handleEdit(subRecord)} >
                  编辑
                </Button>
                <Popconfirm
                  title="确认删除?"
                  onConfirm={() => handleDelete(subRecord.id)}
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
        ]}
        dataSource={children}
        pagination={false}
        expandable={{
          expandedRowRender,
          expandRowByClick: true,
          expandedRowKeys: expandedRowKeys.filter(key => children.some(child => child.id === key)),
          onExpand: (expanded, subRecord) => handleExpand(expanded, subRecord),
          expandIconColumnIndex: -1,
          expandIcon: false,
        }}
        rowKey="id"
      />
    );
  };

  const handleExpand = (expanded, record) => {
    setExpandedRowKeys((prevState) => {
      let newExpandedRowKeys = [...prevState];

      if (expanded) {
        newExpandedRowKeys.push(record.id);
      } else {
        newExpandedRowKeys = newExpandedRowKeys.filter((id) => id !== record.id);
      }

      return newExpandedRowKeys;
    });
  };

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <Button className="edit-btn" onClick={() => handleEdit(record)} >
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
    <div className="category-page">
      <Button
        type="primary"
        onClick={() => {
          setEditCategory(null);
          setIsModalOpen(true);
        }}
        className="refresh-button"
      >
        添加分类
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender,
          expandRowByClick: true,
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => handleExpand(expanded, record),
          expandIconColumnIndex: -1,
          expandIcon: false,
        }}
        className="category-table"
      />
      <Modal
        title={editCategory ? '编辑分类' : '添加分类'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          initialValues={editCategory || {}}
          onFinish={handleOk}
        >
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="父级分类" name="parentId">
            <Select>
              <Select.Option value={null}>无</Select.Option>
              {allCategories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryListPage;
