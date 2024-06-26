import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import "./AddPasswordPopup.css";
import applications from '../Containers/applications';

const AddPasswordPopup = ({onClose, onSubmit}) => {
  const [applicationName, setApplicationName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    // event.preventDefault();
    
    const encryptedPass = CryptoJS.AES.encrypt(password, 'secret-key').toString();
    const formData = {applicationName, username, password: encryptedPass};
    onSubmit(formData);
  } 

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <header className="popup-header">
          <h2>Add New Password</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Application</label>
            <input
              type="text"
              value={applicationName}
              onChange={(e) => setApplicationName(e.target.value)}
              placeholder='Search applications...'
              required
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default AddPasswordPopup;

