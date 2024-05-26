import React, { useState } from 'react';
import { Link } from 'umi';
import { Button, Input } from 'antd';

import './Register.less';

export default function Login() {
  const [payload, setPayload] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="register">
      <div className="register__form">
        <div className="register__form__header">
          <h2>Register</h2>
          <p>
            Register an account in order to start chatting with people, or
            login directly with existing account.
          </p>
        </div>
        <form>
          <Input
            name="name"
            type="text"
            placeholder="Enter your full name"
            onChange={handleOnChange}
          />
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Enter a password"
            onChange={handleOnChange}
          />
          {error && (
            <span style={{ color: 'red', fontSize: '0.75rem' }}>{error}</span>
          )}
          <Button
            block
            onClick={handleOnSubmit}
            className="register-btn"
            loading={loading}
          >
            Register
          </Button>
          <div className="login-link">
            Or, <Link to="/login">Login with existing account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
