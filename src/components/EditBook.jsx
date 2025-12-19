import { Form, Modal, Select, Input, InputNumber, Image } from "antd"
import { useEffect } from "react"

export default function EditBook(props) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (props.book) {
      // จัดเตรียมข้อมูล: ดึง categoryId ออกมาจาก object category
      const formValues = {
        ...props.book,
        categoryId: props.book.category?.id || props.book.categoryId
      }
      form.setFieldsValue(formValues)
    } else {
      form.resetFields()
    }
  }, [props.book, form])

  const handleOk = () => {
    form.validateFields().then(values => {
      // ส่งข้อมูลกลับไป (เอาข้อมูลเดิม merge กับข้อมูลใหม่จากฟอร์ม)
      props.onSave({ ...props.book, ...values })
    })
  }

  return (
    <Modal
      title="Edit Book"
      okText="Save"
      cancelText="Cancel"
      open={props.open}
      onCancel={props.onCancel}
      onOk={handleOk}
    >
      <Form
        form={form}
        layout="vertical"
        name="edit_book_form"
      >
        <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
          <Image 
            src={`http://localhost:3080/${props.book?.coverUrl}`} 
            height={150} 
            fallback="https://via.placeholder.com/150"
          />
        </Form.Item>

        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
          <Select 
            allowClear 
            options={props.categories} 
            placeholder="Select a category"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}