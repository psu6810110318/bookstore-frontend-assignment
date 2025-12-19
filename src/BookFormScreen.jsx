import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, message, Card, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';

const URL_BOOK = "/api/book";
const URL_CATEGORY = "/api/book-category";

export default function BookFormScreen() {
  const navigate = useNavigate();
  const { id } = useParams(); // ดึง id จาก URL (ถ้ามี)
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const isEditMode = !!id; // ถ้ามี id แปลว่าเป็นโหมดแก้ไข

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchBookData(id);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(URL_CATEGORY);
      setCategories(response.data.map(cat => ({ label: cat.name, value: cat.id })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBookData = async (bookId) => {
    setLoading(true);
    try {
      // ดึงข้อมูลหนังสือรายตัวมาแสดงในฟอร์ม
      const response = await axios.get(`${URL_BOOK}/${bookId}`);
      const book = response.data;
      
      // จัด Format ข้อมูลให้ตรงกับ Form (โดยเฉพาะ Category)
      form.setFieldsValue({
        ...book,
        categoryId: book.category?.id || book.categoryId
      });
    } catch (error) {
      message.error('ไม่พบข้อมูลหนังสือ');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (isEditMode) {
        // --- โหมดแก้ไข (Update) ---
        // เลือกเฉพาะข้อมูลที่จำเป็นส่งไป (เหมือนที่เราแก้บั๊กกันก่อนหน้านี้)
        const payload = {
            title: values.title,
            author: values.author,
            price: Number(values.price),
            stock: Number(values.stock),
            categoryId: values.categoryId,
            description: values.description, // เพิ่มเผื่อไว้
            coverUrl: values.coverUrl
        };
        await axios.patch(`${URL_BOOK}/${id}`, payload);
        message.success('แก้ไขข้อมูลหนังสือสำเร็จ');
      } else {
        // --- โหมดเพิ่มใหม่ (Create) ---
        await axios.post(URL_BOOK, values);
        message.success('เพิ่มหนังสือใหม่สำเร็จ');
      }
      navigate('/books'); // บันทึกเสร็จกลับไปหน้ารายการ
    } catch (error) {
      console.error('Submit Error:', error);
      message.error('บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/books')}
        style={{ marginBottom: 16, paddingLeft: 0, fontSize: '16px' }}
      >
        ย้อนกลับไปหน้ารายการ
      </Button>

      <Spin spinning={loading}>
        <Card 
          title={
            // --- ปรับขนาดตัวหนังสือตรงนี้ ---
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {isEditMode ? "แก้ไขหนังสือ (Edit Book)" : "เพิ่มหนังสือใหม่ (Add Book)"}
            </span>
            // -----------------------------
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ price: 0, stock: 0 }}
          >
            <Form.Item name="title" label="ชื่อหนังสือ (Title)" rules={[{ required: true }]}>
              <Input placeholder="ระบุชื่อหนังสือ" />
            </Form.Item>

            <Form.Item name="author" label="ผู้แต่ง (Author)" rules={[{ required: true }]}>
              <Input placeholder="ระบุชื่อผู้แต่ง" />
            </Form.Item>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item name="price" label="ราคา (Price)" rules={[{ required: true }]} style={{ flex: 1 }}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>

              <Form.Item name="stock" label="จำนวนในคลัง (Stock)" rules={[{ required: true }]} style={{ flex: 1 }}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </div>

            <Form.Item name="categoryId" label="หมวดหมู่ (Category)" rules={[{ required: true }]}>
              <Select placeholder="เลือกหมวดหมู่" options={categories} />
            </Form.Item>

             {/* เพิ่มช่องกรอก Cover URL เผื่อไว้ ถ้าอยากให้แก้รูปปกได้ง่ายๆ */}
             <Form.Item name="coverUrl" label="ลิงก์รูปภาพปก (Cover URL)">
                <Input placeholder="http://..." />
            </Form.Item>

            <Form.Item style={{ marginTop: 20, textAlign: 'right' }}>
               <Button onClick={() => navigate('/books')} style={{ marginRight: 8 }}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                {isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มหนังสือ'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}