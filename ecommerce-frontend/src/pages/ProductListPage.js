import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Select } from 'antd';
import api from '../services/api';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);  // 存储当前用户的商品列表
  const [allCategories, setAllCategories] = useState([]);  // 存储所有分类
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);  // 当前编辑的商品
  const [userId, setUserId] = useState(null);  // 当前用户ID

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    const parsedUserId = currentUserId ? Number(currentUserId) : null;

    if (parsedUserId === null || isNaN(parsedUserId)) {
      message.error('未找到有效的用户信息');
      return;
    }

    setUserId(parsedUserId);
    fetchProducts(parsedUserId);  // 获取当前用户的商品列表
    fetchCategories(parsedUserId);  // 获取当前用户的所有分类
  }, []);

  // 获取当前用户的商品
  const fetchProducts = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get('/product', {
        params: { userId },  // 传递 userId 获取当前用户的商品
      });
      setProducts(response.data);  // 存储商品列表
    } catch (error) {
      message.error('获取商品列表失败');
    }
    setLoading(false);
  };

  // 获取当前用户的所有分类
  const fetchCategories = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get('/category/all', {
        params: { userId },  // 传递 userId 获取当前用户的所有分类
      });
      setAllCategories(response.data);  // 存储分类列表
    } catch (error) {
      message.error('获取分类列表失败');
    }
    setLoading(false);
  };

  // 获取商品详细信息
  const fetchProductDetails = async (id) => {
    try {
      const response = await api.get(`/product/${id}`);
      setEditProduct(response.data);  // 填充商品数据
      setIsModalOpen(true);  // 显示编辑表单
    } catch (error) {
      message.error('获取商品详情失败');
    }
  };

  const handleEdit = (product) => {
    fetchProductDetails(product.id);  // 点击编辑时获取商品详细信息
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/product/${id}`);  // 删除商品时传递商品id
      message.success('删除成功');
      fetchProducts(userId);  // 删除后重新获取商品列表
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOk = async (values) => {
    const { name, price, stock, categoryId, description } = values;

    if (!userId) {
      message.error('未找到用户信息');
      return;
    }

    try {
      if (editProduct) {
        await api.patch(`/product/${editProduct.id}`, {
          name,
          price,
          stock,
          categoryId,
          description,
          userId,
        });
        message.success('商品更新成功');
      } else {
        await api.post('/product', {
          name,
          price,
          stock,
          categoryId,
          description,
          userId,
        });
        message.success('商品创建成功');
      }
      setIsModalOpen(false);
      setEditProduct(null);
      fetchProducts(userId);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : '';
  };

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (text) => text.name,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (text) => formatDate(text),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      render: (text) => formatDate(text),
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

  // 配置 expandable，展开行显示商品描述
  const expandable = {
    expandedRowRender: (record) => (
      <div>
        <p>商品描述：{record.description}</p>
      </div>
    ),
    expandRowByClick: true, // 允许通过点击行来展开
    expandIcon: () => null, // 禁用展开图标
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setEditProduct(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: 16 }}
      >
        添加商品
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={expandable}  // 添加 expandable 配置
      />
      <Modal
        title={editProduct ? '编辑商品' : '添加商品'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditProduct(null);
        }}
        footer={null}
      >
        <Form
          initialValues={editProduct ? {
            name: editProduct.name,
            price: editProduct.price,
            stock: editProduct.stock,
            categoryId: editProduct.categoryId,
            description: editProduct.description,
          } : {}}
          onFinish={handleOk}
          key={editProduct ? editProduct.id : 'new'}
        >
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]} 
          >
            <Input placeholder='请输入商品名称' />
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入商品价格' }]} 
          >
            <Input type="number" min={0} placeholder='请输入商品价格' />
          </Form.Item>
          <Form.Item
            name="stock"
            label="库存"
            rules={[{ required: true, message: '请输入商品库存' }]} 
          >
            <Input type="number" min={0} placeholder='请输入商品库存数量' />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="分类"
            rules={[{ required: true, message: '请选择商品分类' }]} 
          >
            <Select placeholder="选择商品分类">
              {allCategories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="商品描述"
            rules={[{ required: true, message: '请输入商品描述' }]} 
          >
            <Input.TextArea placeholder="请输入商品描述" rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductListPage;
