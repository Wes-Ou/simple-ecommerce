import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, message } from 'antd';
import api from '../services/api';

const CategoryProductPage = () => {
  const [categories, setCategories] = useState([]); // 存储分类列表
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); // 用于管理展开的行

  // 获取分类列表
  const fetchCategories = useCallback(async (userId) => {
    setLoading(true);
    try {
      const response = await api.get('/category/all', {
        params: { userId }, // 传递 userId 获取当前用户的所有分类
      });
      const newCategories = response.data || [];
      setCategories(newCategories);
    } catch (error) {
      message.error('获取分类列表失败');
    }
    setLoading(false);
  }, []);

  // 获取分类下的商品
  const fetchProducts = async (categoryId) => {
    try {
      const response = await api.get(`/product/category/${categoryId}`); // 根据分类ID获取商品
      return response.data || []; // 返回商品数据
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

    fetchCategories(parsedUserId); // 获取当前用户的所有分类
  }, [fetchCategories]);

  // 展开行时渲染商品
  const expandedRowRender = (record) => {
    const productColumns = [
      { title: '商品名称', dataIndex: 'name' },
      { title: '价格', dataIndex: 'price' },
      { title: '库存', dataIndex: 'stock' },
      { title: '描述', dataIndex: 'description' }, // 商品描述列
    ];

    return (
      <Table
        rowKey="id"
        columns={productColumns}
        dataSource={record.products || []} // 显示该分类下的商品
        pagination={false} // 不显示分页
        size="small"
      />
    );
  };

  // 行点击事件触发展开
  const handleRowClick = async (record) => {
    if (!record.products) {
      const products = await fetchProducts(record.id);
      if (products.length === 0) {
        message.info('该分类下暂无商品', 1); // 提示无商品
        return; // 阻止展开操作
      }
      const updatedCategories = categories.map((category) =>
        category.id === record.id ? { ...category, products } : category
      );
      setCategories(updatedCategories); // 更新分类数据，给对应的分类添加商品
    }

    const isExpanded = expandedRowKeys.includes(record.id);
    const newExpandedRowKeys = isExpanded
      ? expandedRowKeys.filter((key) => key !== record.id)
      : [...expandedRowKeys, record.id];
    setExpandedRowKeys(newExpandedRowKeys); // 更新展开的行
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => fetchCategories(localStorage.getItem('userId'))} // 刷新分类列表
        style={{ marginBottom: 16 }}
      >
        刷新分类列表
      </Button>
      <Table
        rowKey="id"
        columns={[
          {
            title: '分类名称',
            dataIndex: 'name',
          },
        ]}
        dataSource={categories}
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender, // 自定义展开行内容
          expandedRowKeys,
          showExpandColumn: false, // 移除默认展开图标
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // 行点击触发展开/折叠
        })}
      />
    </div>
  );
};

export default CategoryProductPage;
