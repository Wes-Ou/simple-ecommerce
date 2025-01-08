import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, message } from 'antd';
import api from '../services/api';
import './CategoryProductPage.css';

const CategoryProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const fetchCategories = useCallback(async (userId) => {
    setLoading(true);
    try {
      const response = await api.get('/category/all', {
        params: { userId },
      });
      const newCategories = response.data || [];

      for (let category of newCategories) {
        if (expandedRowKeys.includes(category.id)) {
          const products = await fetchProducts(category.id);
          category.products = products;
        }
      }

      setCategories(newCategories);
    } catch (error) {
      message.error('获取分类列表失败');
    }
    setLoading(false);
  }, [expandedRowKeys]);

  const fetchProducts = async (categoryId) => {
    try {
      const response = await api.get(`/product/category/${categoryId}`);
      return response.data || [];
    } catch (error) {
      message.error('获取商品列表失败');
      return [];
    }
  };

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    const parsedUserId = currentUserId ? Number(currentUserId) : null;

    if (parsedUserId === null || isNaN(parsedUserId)) {
      message.error('未找到有效的用户信息');
      return;
    }

    fetchCategories(parsedUserId);
  }, [fetchCategories]);

  const productColumns = [
    { title: '商品名称', dataIndex: 'name', width: '15%' },
    { title: '价格', dataIndex: 'price', width: '10%' },
    { title: '库存', dataIndex: 'stock', width: '10%' },
    { title: '描述', dataIndex: 'description', width: '35%' },
  ];

  const expandedRowRender = (record) => (
    <Table
      rowKey="id"
      columns={productColumns}
      dataSource={record.products || []}
      pagination={false}
      size="small"
      className="nested-product-table"
    />
  );

  const handleRowClick = async (record) => {
    if (!record.products) {
      const products = await fetchProducts(record.id);
      if (products.length === 0) {
        message.info('该分类下暂无商品', 1);
        return;
      }
      const updatedCategories = categories.map((category) =>
        category.id === record.id ? { ...category, products } : category
      );
      setCategories(updatedCategories);
    }

    const isExpanded = expandedRowKeys.includes(record.id);
    const newExpandedRowKeys = isExpanded
      ? expandedRowKeys.filter((key) => key !== record.id)
      : [...expandedRowKeys, record.id];
    setExpandedRowKeys(newExpandedRowKeys);
  };

  return (
    <div className="category-product-page">
      <Button
        type="primary"
        onClick={() => fetchCategories(localStorage.getItem('userId'))}
        className="refresh-button"
      >
        刷新分类列表
      </Button>
      <Table
        rowKey="id"
        columns={[{
          title: '分类名称',
          dataIndex: 'name',
        }]}
        dataSource={categories}
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender,
          expandedRowKeys,
          showExpandColumn: false,
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        className="category-table"
      />
    </div>
  );
};

export default CategoryProductPage;
