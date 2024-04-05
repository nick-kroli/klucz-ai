// CreateAccPage.js

import React, { useState } from 'react';

const CreateAccPage = ({ onCreateClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCreateAccountClick = () => {
    onCreateClick(username, password);
  };

  return (
    <div className="create-account-page">
      <h2>Create Account</h2>
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
          <button type="button" onClick={handleCreateAccountClick}>Create Account</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccPage;
