import React, { useState } from 'react';
import "./Popup.css";
import CryptoJS from 'crypto-js';
import { evaluatePasswordStrength } from '../Functions/evaluatePasswordStrength';

const UpdatePopup = ({ onClose, onSubmit, initialUsername, initialPassword, encryptionKey}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const score_info = evaluatePasswordStrength(username, password);
    const encryptedPass = CryptoJS.AES.encrypt(password, encryptionKey).toString();    
    onSubmit({
      oldUsername: initialUsername,
      oldPassword: initialPassword,
      username,
      encryptedPass,
      score_info
    });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Edit Password Entry</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="popup-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <div className="popup-actions">
              <button type="submit" className="confirm-button">Update</button>
              <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePopup;