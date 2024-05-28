import { useEffect, useState } from 'react';
import { Link, history } from 'umi';
import { Button, Form, Input } from 'antd';
import { useRequest } from 'ahooks';

import useSession from '@/hooks/useSession';
import { apiPost, endpoints } from '@/utils/request';

import './Login.less';

export default function Login() {
  const { login } = useSession();

  const {
    data,
    error,
    loading,
    run: submit,
  } = useRequest(payload => apiPost(endpoints.login, {
    data: payload,
    getResponse: true,
  }), { manual: true });
  
  const [authError, setAuthError] = useState(false);
  const [errMessage, setErrMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const { response, data: errData } = error as Record<string, any>;
      const { status } = response;
      setAuthError(true);

      if (status === 401) {
        setErrMessage(errData.message);
      } else {
        setErrMessage(`Network error occured. Err#${status}`);
      }
    }
  }, [error]);

  useEffect(() => {
    const { data: session } = data || {};
    if (session) {
      login(session.data);

      history.push('/');
    }
  }, [data]);

  return (
    <div className="login">
      <div className="login__form">
        <div className="login__form__header">
          <h2>Welcome back!</h2>
          <p>We're so excited to see you again.</p>
        </div>
        {!authError && (
          <Form onFinish={submit}
            autoCapitalize="off"
            autoComplete="off"
          >
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
                  message: 'Password is missing',
                }
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Form.Item>
              <Button
                block
                htmlType="submit"
                className="login-btn"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
            <div className="register-link">
              Or, <Link to="/register">Register a new account</Link>
            </div>
          </Form>
        )}

        {authError && (
          <div>
            <div className="mb align-center mb">
              <h3 className="red">{errMessage}</h3>
            </div>
            <div className="mt">
              <Button
                loading={loading}
                className="retry-btn"
                onClick={() => setAuthError(false)}
              >
                Try again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
