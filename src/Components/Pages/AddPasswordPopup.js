import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import "./AddPasswordPopup.css";
import applications from '../Containers/applications';

const AddPasswordPopup = ({onClose, onSubmit, encryptionKey}) => {
  const [applicationName, setApplicationName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const val = event.target.value;
    setApplicationName(val);
    if (val) {
      const filteredSuggestions = Object.keys(applications).filter(app => app.toLowerCase().startsWith(val.toLowerCase()));
      setSuggestions(filteredSuggestions);
    }else{
      setSuggestions([]);
    }
  }

  const handleSuggestionClick = (app) => {
    setApplicationName(app);
    setSuggestions([]);
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    //NEED TO USE DERIVED ENCRYPTION KEY FROM HASH
    // console.log('hits?');
    console.log(evaluatePasswordStrength(password));
    const encryptedPass = CryptoJS.AES.encrypt(password, encryptionKey).toString();
    const formData = {applicationName, username, password: encryptedPass};
    onSubmit(formData);
  } 

  function evaluatePasswordStrength(password) {
    let score = 0;

    if (password.length >= 12) {
        score += 200;
    } else if (password.length >= 10) {
        score += 100;
    } else {
        score += 50;
    }
    
    let categories = 0;
    if (/[A-Z]/.test(password)) categories++;
    if (/[a-z]/.test(password)) categories++;
    if (/\d/.test(password)) categories++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) categories++;
    
    if (categories === 4) {
        score += 200;
    } else if (categories === 3) {
        score += 150;
    } else if (categories === 2) {
        score += 100;
    } else {
        score += 50;
    }
    

    //Last 100 points for commonly used words, similar to username, years, predictable patterns, entropy maybe?


    return score;
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
              onChange={handleInputChange}
              placeholder='Search applications...'
              required
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion)} className="suggestion-item">
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
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

