import React, { useState } from 'react';
import './WelcomePage.css';

const WelcomePage = ({ onSubmitClick }) => {
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleMasterPasswordChange = (event) => {
    setMasterPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (masterPassword !== confirmPassword) {
      setError('Passwords do not match');
    } else if (masterPassword.length < 8) {
      setError('Password must be at least 8 characters long');
    } else {
      onSubmitClick(masterPassword);
    }
  };

  return (
    <div className="welcome-container">
      <h1>WELCOME</h1>
      <h3>Let's get started by setting up your master password! This will serve as the secret key to unlocking your vault of passwords. Make sure you remember your master password as you will be locked out of your vault permanently if you lose it!</h3>

      <form onSubmit={handleSubmit} className="password-form">
        <div className="input-group">
          <label htmlFor="masterPassword">Master Password</label>
          <input
            type="password"
            id="masterPassword"
            value={masterPassword}
            onChange={handleMasterPasswordChange}
            placeholder="Enter your master password"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your master password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">Create Master Password</button>
      </form>
    </div>
  );
};

export default WelcomePage;