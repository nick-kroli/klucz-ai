import React, { useState } from 'react';
import './SearchBar.css';

const applications = [
  'Facebook',
  'Twitter',
  'Instagram',
  'LinkedIn',
  'Snapchat',
  'Pinterest',
  'Reddit',
  'TikTok',
  'WhatsApp',
  'YouTube'
];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
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

  return (
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
    </div>
  );
};

export default SearchBar;
