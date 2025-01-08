import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, Select, message } from 'antd';
import api from '../services/api';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);  // 存储当前用户的顶级分类
  const [allCategories, setAllCategories] = useState([]);  // 存储当前用户的所有分类
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [userId, setUserId] = useState(null);  // 当前用户ID
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);  // 用于存储展开状态的分类的id

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');  // 假设从 localStorage 获取
    const parsedUserId = currentUserId ? Number(currentUserId) : null;

    if (parsedUserId === null || isNaN(parsedUserId)) {
      message.error('未找到有效的用户信息');
      return;
    }

    setUserId(parsedUserId);
    fetchTopLevelCategories(parsedUserId);  // 获取当前用户的顶级分类
    fetchAllCategories(parsedUserId);  // 获取当前用户的所有分类
  }, []);

  // 获取当前用户的顶级分类 (parentId: null)
  const fetchTopLevelCategories = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get('/category', {
        params: { userId },  // 传递 userId 获取当前用户的顶级分类
      });
      setCategories(response.data);  // 存储顶级分类
    } catch (error) {
      message.error('获取顶级分类失败');
    }
    setLoading(false);
  };

  // 获取当前用户的所有分类
  const fetchAllCategories = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get('/category/all', {
        params: { userId },  // 传递 userId 获取当前用户的所有分类
      });
      setAllCategories(response.data);  // 存储所有分类
    } catch (error) {
      message.error('获取所有分类失败');
    }
    setLoading(false);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setIsModalOpen(true);  // 修改为 setIsModalOpen
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/category/${id}`);  // 删除时只传递分类id
      message.success('删除成功');
      fetchTopLevelCategories(userId);  // 删除后重新获取顶级分类
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
        // 更新分类时传递 userId 和 parentId
        await api.patch(`/category/${editCategory.id}`, {
          name,
          parentId,
          userId,
        });
        message.success('分类更新成功');
      } else {
        // 创建分类时传递 userId 和 parentId
        await api.post('/category', {
          name,
          parentId,
          userId,
        });
        message.success('分类创建成功');
      }
      setIsModalOpen(false);  // 修改为 setIsModalOpen
      fetchTopLevelCategories(userId);  // 更新后重新获取顶级分类
      fetchAllCategories(userId);  // 更新后重新获取所有分类
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 获取当前分类的子分类
  const getChildren = (parentId) => {
    return allCategories.filter((category) => category.parentId === parentId);
  };

  // 递归渲染子分类
  const expandedRowRender = (record) => {
    const children = getChildren(record.id);

    // 只有当该分类有子分类时，才渲染子表格
    if (children.length === 0) {
      return null;  // 没有子分类时不渲染子表格
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
                <Button onClick={() => handleEdit(subRecord)} type="link">
                  编辑
                </Button>
                <Popconfirm
                  title="确认删除?"
                  onConfirm={() => handleDelete(subRecord.id)}  // 删除子分类
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
        dataSource={children}  // 只显示该分类的子分类
        pagination={false}
        expandable={{
          expandedRowRender,  // 递归展开子分类
          expandRowByClick: true,  // 点击展开行
          expandedRowKeys: expandedRowKeys.filter(key => children.some(child => child.id === key)),  // 只展开当前分类的子分类
          onExpand: (expanded, subRecord) => handleExpand(expanded, subRecord),  // 处理子分类展开状态
          expandIconColumnIndex: -1,  // 禁用左侧展开图标
          expandIcon: false,  // 禁用展开图标
        }}
        rowKey="id"  // 确保每个子分类行有唯一的 key
      />
    );
  };

  // 控制点击行展开/关闭
  const handleExpand = (expanded, record) => {
    setExpandedRowKeys((prevState) => {
      let newExpandedRowKeys = [...prevState];

      if (expanded) {
        // 展开时添加当前分类id
        newExpandedRowKeys.push(record.id);
      } else {
        // 收起时移除当前分类id
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
      render: (text) => new Date(text).toLocaleString(),  // 格式化日期
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      render: (text) => new Date(text).toLocaleString(),  // 格式化日期
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
            onConfirm={() => handleDelete(record.id)}  // 删除分类
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
          setIsModalOpen(true);  // 修改为 setIsModalOpen
        }}
        style={{ marginBottom: 16 }}
      >
        添加分类
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}  // 显示顶级分类
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender,  // 显示子分类
          expandRowByClick: true,  // 点击展开
          expandedRowKeys: expandedRowKeys,  // 控制展开的行
          onExpand: (expanded, record) => handleExpand(expanded, record),  // 处理展开状态
          expandIconColumnIndex: -1,  // 禁用左侧展开图标
          expandIcon: false,  // 禁用展开图标
        }}
      />
      <Modal
        title={editCategory ? '编辑分类' : '添加分类'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}  // 修改为 setIsModalOpen
        footer={null}
      >
        <Form
          initialValues={editCategory || {}}
          onFinish={handleOk}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="parentId" label="父分类">
            <Select
              placeholder="请选择父分类"
              defaultValue={editCategory?.parentId || null}
            >
              <Select.Option value={null}>无</Select.Option>
              {categories.map((category) => (
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
