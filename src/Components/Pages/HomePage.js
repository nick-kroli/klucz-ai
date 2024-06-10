import React from 'react'
import Sidebar from './Sidebar';
import { useState } from 'react';
import './HomePage.css';


const HomePage = ({managed_apps}) => {

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
        <h1 style={{backgroundColor: 'red'}}>Welcome back to klucz AI!</h1>
        <div className='dashboard'>hi</div>
        {/* Add your main content here */}
        <div className='big-password-container'>
          {managed_apps.map((app, index) => (
            <div className="small-password-container" key={index}>
              {/* Add content related to each app */}
              {app}
            </div>
          ))} 
        </div>
      </div>
    </div>
  );
};


export default HomePage;