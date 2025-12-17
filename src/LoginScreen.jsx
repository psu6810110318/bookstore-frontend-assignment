import { useState } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd';
import axios from 'axios'

const URL_AUTH = "/api/auth/login"

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)

  const handleLogin = async (values) => {
    try {
      setIsLoading(true)
      setErrMsg(null)
      const response = await axios.post(URL_AUTH, {
        username: values.username,
        password: values.password
      });
      const token = response.data.access_token;

      if (values.remember) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }

      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
      props.onLoginSuccess();
    } catch (err) {
      setErrMsg(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form
      onFinish={handleLogin}
      initialValues={{ remember: false }}
      autoComplete="off">
      {errMsg &&
        <Form.Item>
          <Alert message={errMsg} type="error" />
        </Form.Item>
      }

      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember Me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit" loading={isLoading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}