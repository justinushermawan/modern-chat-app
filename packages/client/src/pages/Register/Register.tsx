import { useEffect, useState } from 'react';
import { Link, history } from 'umi';
import { Button, Form, Input } from 'antd';
import { useRequest } from 'ahooks';

import { apiPost, endpoints } from '@/utils/request';

import './Register.less';

export default function Login() {
  const {
    data,
    error,
    loading,
    run: submit,
  } = useRequest(payload => apiPost(endpoints.register, {
    data: payload,
    getResponse: true,
  }), { manual: true });
  
  const [hasError, setHasError] = useState(false);
  const [errMessage, setErrMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const { response, data: errData } = error as Record<string, any>;
      const { status } = response;
      setHasError(true);

      if (status === 400) {
        setErrMessage(errData.message);
      } else {
        setErrMessage(`Network error occured. Err#${status}`);
      }
    }
  }, [error]);

  useEffect(() => {
    const { data: userData } = data || {};
    if (userData) {
      history.push('/login');
    }
  }, [data]);

  return (
    <div className="register">
      <div className="register__form">
        <div className="register__form__header">
          <h2>Register</h2>
          <p>
            Register an account in order to start chatting with people, or
            login directly with existing account.
          </p>
        </div>
        <Form onFinish={submit}
          autoCapitalize="off"
          autoComplete="off"
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Name is required',
              }
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Email is required',
              }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Password is required',
              }
            ]}
          >
            <Input.Password placeholder="Enter a password" />
          </Form.Item>

          {hasError && (
            <span style={{ color: 'red', fontSize: '0.75rem' }}>{errMessage}</span>
          )}

          <Button
            block
            htmlType="submit"
            className="register-btn"
            loading={loading}
          >
            Register
          </Button>
          <div className="login-link">
            Or, <Link to="/login">Login with existing account</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
