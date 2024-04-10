import React, { useState } from 'react';
import { useContext } from 'react';
import { Account, AccountContext } from '../../SessionsAccount/Account.js';

const LoginPage = ({ onLogin, onCreateAccount }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { authenticate } = useContext(AccountContext)

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    // Perform login logic, e.g., validate credentials
    onLogin(username, password);
  };
  const handleCreateAccountClick = () => {
    onCreateAccount();
  };

  return (
    <div className="login-page">
      <h2>Login hi</h2>
      <form>
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
    </div>
  );
};

export default LoginPage;
