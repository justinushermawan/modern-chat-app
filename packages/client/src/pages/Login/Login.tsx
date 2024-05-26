import React, { useState } from 'react';
import { Link } from 'umi';
import { Button, Input } from 'antd';

import './Login.less';

export default function Login() {
  const [payload, setPayload] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setPayload((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleOnSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    //
  };

  return (
    <div className="login">
      <div className="login__form">
        <div className="login__form__header">
          <h2>Welcome back!</h2>
          <p>We're so excited to see you again.</p>
        </div>
        <form>
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={handleOnChange}
          />
          <Button
            block
            onClick={handleOnSubmit}
            className="login-btn"
            loading={loading}
          >
            Login
          </Button>
          <div className="register-link">
            Or, <Link to="/register">Register a new account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
