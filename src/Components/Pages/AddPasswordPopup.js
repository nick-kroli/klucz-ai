import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import "./AddPasswordPopup.css";
import applications from '../Containers/applications';
import { stringSimilarity } from "string-similarity-js";

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
    const password_score = evaluatePasswordStrength(username, password);
    const encryptedPass = CryptoJS.AES.encrypt(password, encryptionKey).toString();
    const formData = {applicationName, username, password: encryptedPass, password_score};
    onSubmit(formData);
  } 

  function evaluatePasswordStrength(username , password) {
    let score = 0;
    let feedback = [];

    // Existing length check
    if (password.length >= 12) {
        score += 200;
    } else if (password.length >= 10) {
        score += 100;
    } else {
        score += 50;
    }
    
    // Existing character category check
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

    console.log('gets user: ', username, 'at this point score is ', score)
    let additionalScore = 0;

    const commonWords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];
    if (!commonWords.some(word => password.toLowerCase().includes(word))) {
        additionalScore += 30;
        feedback.push("Password doesn't contain obvious common words");
    } else {
        feedback.push("Password contains commonly used words");
    }

    if (username && username.length > 0) {
        const similarity = stringSimilarity(password.toLowerCase(), username.toLowerCase());
        if (similarity < 0.5) {
            additionalScore += 25;
            feedback.push("Password is sufficiently different from the username");
        } else {
            feedback.push("Password is too similar to the username");
        }
    }

    const patterns = [
        /\d{3,}/,  // Three or more consecutive digits
        /[a-zA-Z]{3,}/,  // Three or more consecutive letters
        /[@#$%^&*]{3,}/  // Three or more consecutive special characters
    ];
    if (!patterns.some(pattern => pattern.test(password))) {
        additionalScore += 25;
        feedback.push("Password doesn't contain predictable patterns");
    } else {
        feedback.push("Password contains predictable patterns");
    }

    //entropy
    const uniqueChars = new Set(password).size;
    const entropy = Math.log2(Math.pow(uniqueChars, password.length));
    const entropyScore = Math.min(20, Math.floor(entropy / 2));
    additionalScore += entropyScore;
    feedback.push(`Entropy score: ${entropyScore}/20`);

    // Add the additional score (max 100)
    score += Math.min(100, additionalScore);

    return { score, feedback };
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

