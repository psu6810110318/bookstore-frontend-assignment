import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const URL_CATEGORY = "/api/book-category";

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // เก็บข้อมูลหมวดหมู่ที่กำลังแก้ไข
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_CATEGORY);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('โหลดข้อมูลหมวดหมู่ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record); // ดึงค่าเดิมมาใส่ฟอร์ม
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL_CATEGORY}/${id}`);
      message.success('ลบหมวดหมู่สำเร็จ');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('ลบไม่สำเร็จ (หมวดหมู่นี้อาจมีหนังสือใช้งานอยู่)');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        // กรณีแก้ไข (Edit)
        await axios.patch(`${URL_CATEGORY}/${editingCategory.id}`, values);
        message.success('แก้ไขหมวดหมู่สำเร็จ');
      } else {
        // กรณีเพิ่มใหม่ (Add)
        await axios.post(URL_CATEGORY, values);
        message.success('เพิ่มหมวดหมู่สำเร็จ');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      message.error('บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>จัดการหมวดหมู่สินค้า (Categories)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Category
        </Button>
      </div>
      
      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />

      {/* Modal สำหรับ Add/Edit */}
      <Modal
        title={editingCategory ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'กรุณากรอกชื่อหมวดหมู่!' }]}
          >
            <Input placeholder="เช่น Fiction, Science, etc." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}