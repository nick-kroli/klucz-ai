import React, { useState, useEffect } from 'react';
import './WelcomePage.css';

const WelcomePage = ({ onSubmitClick, applications }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value) {
      const filteredSuggestions = applications.filter(app =>
        app.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (app) => {
    if (!selectedApps.includes(app)) {
      setSelectedApps([...selectedApps, app]);
    }
    setQuery('');
    setSuggestions([]);
  };

  const handleRemoveClick = (app) => {
    setSelectedApps(selectedApps.filter(selectedApp => selectedApp !== app));
  };

  const handleSubmitClick = () => {
    onSubmitClick(selectedApps);
  };

  useEffect(() => {
    if (selectedApps.length > 0) {
      setShowButton(true);
      setIsExiting(false);
    } else if (selectedApps.length === 0 && showButton) {
      setIsExiting(true);
      setTimeout(() => {
        setShowButton(false);
        setIsExiting(false);
      }, 500); // match this duration to the CSS animation duration
    }
  }, [selectedApps]);

  return (
    <div>
      <h1 >WELCOME TO KLUCZ</h1>
      <h3>Lets get started by choosing a few applications you are interested in managing your passwords for!</h3>

      <div className="search-bar-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search applications..."
          className="search-input"
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
        <div className="selected-apps">
          {selectedApps.map((app, index) => (
            <span key={index} className="selected-app">
              <button className="remove-button" onClick={() => handleRemoveClick(app)}>x</button>
              {app}
            </span>
          ))}
        </div>

        {showButton && (
          <button className={`proceed-button ${showButton ? 'proceed-button-enter' : ''} ${isExiting ? 'proceed-button-exit' : ''}`} onClick={handleSubmitClick}>
            Proceed to home
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
