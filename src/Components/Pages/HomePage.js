import React from 'react'
import Sidebar from './Sidebar';
import { useState } from 'react';
const HomePage = ({onLogOut}) => {

  const [isCollapsed, setCollapsed] = useState(true);

  const toggleCollapse = () => {
    setCollapsed(!isCollapsed);
  }

  return (
    <div className="home-page">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <button onClick={toggleCollapse}>
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
        {/* Add your sidebar content here */}
        <nav>
          <ul>
            <li><a href="#section1">Section 1</a></li>
            <li><a href="#section2">Section 2</a></li>
            <li><a href="#section3">Section 3</a></li>
          </ul>
        </nav>
      </div>
      <div className="content">
        <h1>Welcome back to klucz AI!</h1>
        {/* Add your main content here */}
      </div>
    </div>
  );
};


export default HomePage;