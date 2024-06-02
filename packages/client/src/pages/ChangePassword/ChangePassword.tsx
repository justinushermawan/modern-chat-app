import { useEffect, useState } from 'react';
import { Link, history } from 'umi';
import { Button, Form, Input, message as antdMessage } from 'antd';
import { useRequest } from 'ahooks';

import useSession from '@/hooks/useSession';
import { apiPost, endpoints } from '@/utils/request';

import './ChangePassword.less';

export default function Login() {
  const { logout } = useSession();

  const {
    data,
    error,
    loading,
    run: submit,
  } = useRequest(payload => apiPost(endpoints.changePassword, {
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
    const { data: updatedData } = data || {};
    if (updatedData) {
      antdMessage.success('Password changed successfully. Please re-login');
      logout();
      history.push('/login');
    }
  }, [data]);

  return (
    <div className="change-password">
      <div className="change-password__form">
        <div className="change-password__form__header">
          <h2>Change your password</h2>
          <p>Enter your current and new password below.</p>
        </div>
        {!authError && (
          <Form onFinish={submit}
            autoCapitalize="off"
            autoComplete="off"
          >
            <Form.Item
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: 'Current password is required',
                }
              ]}
            >
              <Input.Password placeholder="Enter your current password" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: 'New password is missing',
                }
              ]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item>
              <Button
                block
                htmlType="submit"
                className="change-password-btn"
                loading={loading}
              >
                Submit
              </Button>
            </Form.Item>
            <div className="register-link">
              Or, <Link to="/">Back to Home</Link>
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
