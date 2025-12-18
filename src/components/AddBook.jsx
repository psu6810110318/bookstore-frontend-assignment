import { Button, Form, Select, Input, InputNumber, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddBook(props) {
  const [form] = Form.useForm(); // สร้าง instance ของ form เพื่อเคลียร์ข้อมูลหลังส่ง

  return (
    <Form 
      form={form}
      layout="vertical" // เปลี่ยนเป็น vertical เพื่อให้ดูเต็มหน้าจอและกรอกง่ายขึ้น
      onFinish={values => {
        props.onBookAdded({ ...values });
        form.resetFields(); // ล้างข้อมูลในช่องกรอกหลังจากกดเพิ่มสำเร็จ
      }}
      style={{ width: '100%' }}
    >
      <Row gutter={[16, 0]} align="bottom"> {/* ใช้ Row เพื่อคุมบรรทัด และ gutter เพื่อเว้นระยะห่างระหว่างช่อง */}
        
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="ชื่อหนังสือ" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={5}>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input placeholder="ชื่อผู้แต่ง" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber placeholder="ราคา" style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber placeholder="คลัง" style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
            <Select 
              allowClear 
              placeholder="เลือกหมวด"
              style={{ width: '100%' }} 
              options={props.categories}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={3}>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%', marginBottom: '0' }}
            >
              New Book
            </Button>
          </Form.Item>
        </Col>

      </Row>
    </Form>
  );
}