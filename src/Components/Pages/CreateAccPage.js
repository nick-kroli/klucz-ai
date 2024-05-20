// CreateAccPage.js

import React, { useState } from 'react';

const CreateAccPage = ({ onCreateClick, errorMess}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleCreateAccountClick = () => {
    onCreateClick(username, password, email);
  };

  return (
    <div className="create-account-page">
      <h2>Create Account</h2>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
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
          <button type="button" onClick={handleCreateAccountClick}>Create Account</button>
        </div>
      </form>
      {errorMess && (
        <div style={{ color: 'red', textAlign: 'center' }}>
          {errorMess}
        </div>
      )}
    </div>
  );
};

export default CreateAccPage;
