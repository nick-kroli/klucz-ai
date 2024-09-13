import React, { useState } from 'react';
import { useContext } from 'react';
import { Account, AccountContext } from '../../SessionsAccount/Account.js';
import './Login.css';

const LoginPage = ({ onLogin, onCreateAccount, errorMess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { authenticate } = useContext(AccountContext);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };  

  const handleLogin = () => {
    onLogin(username, password);
  };

  const handleCreateAccountClick = () => {
    onCreateAccount();
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={handleLogin}>Login</button>
          <button type="button" onClick={handleCreateAccountClick}>Create Account</button>
        </div>
      </form>
      {errorMess && (
        <div className="error-message">
          {errorMess}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
