import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Select } from 'antd';
import api from '../services/api';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    const parsedUserId = currentUserId ? Number(currentUserId) : null;

    if (parsedUserId === null || isNaN(parsedUserId)) {
      message.error('未找到有效的用户信息');
      return;
    }

    setUserId(parsedUserId);
    fetchProducts(parsedUserId);
    fetchCategories(parsedUserId);
  }, []);

  const fetchProducts = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get('/product', {
        params: { userId },
      });
      setProducts(response.data);
    } catch (error) {
      message.error('获取商品列表失败');
    }
    setLoading(false);
  };

  const fetchCategories = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get('/category/all', {
        params: { userId },
      });
      setAllCategories(response.data);
    } catch (error) {
      message.error('获取分类列表失败');
    }
    setLoading(false);
  };

  const fetchProductDetails = async (id) => {
    try {
      const response = await api.get(`/product/${id}`);
      setEditProduct(response.data);
      setIsModalOpen(true);
    } catch (error) {
      message.error('获取商品详情失败');
    }
  };

  const handleEdit = (product) => {
    fetchProductDetails(product.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/product/${id}`);
      message.success('删除成功');
      fetchProducts(userId);
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
          <Button className="edit-btn" onClick={() => handleEdit(record)}>
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

  const expandable = {
    expandedRowRender: (record) => (
      <div>
        <p>商品描述：{record.description}</p>
      </div>
    ),
    expandRowByClick: true,
    expandIcon: () => null,
  };

  return (
    <div className="product-page">
      <Button
        type="primary"
        className="add-product-button"
        onClick={() => {
          setEditProduct(null);
          setIsModalOpen(true);
        }}
      >
        添加商品
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={expandable}
        className="product-table"
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
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入商品价格' }]}
          >
            <Input type="float" min={0} placeholder="请输入商品价格" />
          </Form.Item>
          <Form.Item
            name="stock"
            label="库存"
            rules={[{ required: true, message: '请输入商品库存' }]}
          >
            <Input type="number" min={0} placeholder="请输入商品库存数量" />
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
