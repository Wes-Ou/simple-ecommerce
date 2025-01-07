import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import api from '../services/api'; // 导入封装的API请求

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // 获取所有商品
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      message.error('获取商品失败');
    }
    setLoading(false);
  };

  // 打开编辑模态框
  const handleEdit = (product) => {
    setEditProduct(product);
    setIsModalVisible(true);
  };

  // 删除商品
  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      message.success('删除成功');
      fetchProducts();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 提交编辑的商品信息
  const handleOk = async (values) => {
    const { name, description, price, stock, categoryId } = values;
    try {
      if (editProduct) {
        await api.patch(`/products/${editProduct.id}`, {
          name,
          description,
          price,
          stock,
          categoryId,
        });
        message.success('商品更新成功');
      } else {
        await api.post('/products', {
          name,
          description,
          price,
          stock,
          categoryId,
        });
        message.success('商品创建成功');
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 商品详情列
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
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
      render: (category) => category?.name || '未分类',
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
          setEditProduct(null);
          setIsModalVisible(true);
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
      />
      <Modal
        title={editProduct ? '编辑商品' : '添加商品'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editProduct || {}}
          onFinish={handleOk}
          layout="vertical"
        >
          <Form.Item
            label="商品名称"
            name="name"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="商品描述"
            name="description"
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="商品价格"
            name="price"
            rules={[{ required: true, message: '请输入商品价格' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="商品库存"
            name="stock"
            rules={[{ required: true, message: '请输入商品库存' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="商品分类"
            name="categoryId"
            rules={[{ required: true, message: '请选择商品分类' }]}
          >
            <Input type="number" placeholder="输入分类ID" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editProduct ? '更新商品' : '创建商品'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductListPage;
