import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import './HomePage.css';
import AddPasswordPopup from './AddPasswordPopup';
import DeletePopup from './DeletePopup';
import applications from '../Containers/applications';


const HomePage = ({ managed_apps , onPassSubmit, onPassDelete}) => {
  const managed_apps_keys = Object.keys(managed_apps);
  const [isCollapsed, setCollapsed] = useState(true);
  // const [passwordVisibility, setPasswordVisibility] = useState(
  //   Array(managed_apps_keys.length).fill(false)
  // );

  
  // console.log("keys length: ",managed_apps_keys.length);


  const [showSubcategories, setShowSubcategories] = useState(false);
  const subcategoriesRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [passDisplay, setPassDisplay] = useState('categories');
  const [isEntryPop, setIsEntryPop] = useState(false);
  const [isDeleteSure, setIsDeleteSure] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [currentPass, setCurrentPass] = useState("");


  const toggleCollapse = () => {
    setCollapsed(!isCollapsed);
  };

  const toggleSubcategories = () => {
    setShowSubcategories(!showSubcategories);
  };

  const toggleDisplayMode = () => {
    setPassDisplay(prevMode => (prevMode === 'categories' ? 'showall' : 'categories'));
  };

  const toggleEntryPop1 = () => {
    setIsEntryPop(!isEntryPop);
    console.log("Pop up: ", isEntryPop);
  }

  const toggleDeletePop = () => {
    setIsDeleteSure(!isDeleteSure);
    console.log("Pop up: ", isDeleteSure);
  }

  const handlePassSubmit = (formData) => {
    // Handle form data 
    console.log('Form submitted:', formData);
    toggleEntryPop1(); // Close the pop-up after submission
    onPassSubmit(formData);
  };

  const handlePassDelete = (app, e) => {
    e.stopPropagation();
    toggleDeletePop();
    console.log("Deleting password....", app);
    onPassDelete(app);
  }

  const handlePassRetrieve = (app) => {
    setCurrentPass(managed_apps[app]);
  }
  
  const toggleShowPass = () => {
    setShowPass(!showPass);
  }

  useEffect(() => {
    if (subcategoriesRef.current) {
      if (showSubcategories) {
        subcategoriesRef.current.style.maxHeight = `${subcategoriesRef.current.scrollHeight}px`;
      } else {
        subcategoriesRef.current.style.maxHeight = '0px';
      }
    }
  }, [showSubcategories,managed_apps_keys.length]);

  const copyClipboard = (text) => {
    navigator.clipboard.writeText(text).then(function() {
    }).catch(function(error) {
      console.error("Error copying text: ", error);
    });
  };

  const toggleSmallPass = (index) => {
    setShowPass(false)
    if (activeIndex === index) {
      console.log("LEAVING1");
      setIsExiting(true);
      setTimeout(() => {
        setActiveIndex(null);
        setIsExiting(false);
        setShowDetails(false);
      }, 350); // match this duration to the CSS animation duration
    } else {
      // handlePassRetrieve(app);
      setActiveIndex(index);
      setShowDetails(true);
    }
  };

  const SmallPassFuncs = (app, index) => {
    toggleSmallPass(index);
    handlePassRetrieve(app)
  }

  const date_changed = "06/17/2024";
  const date_added = "06/01/2024";

  return (
    <div className="home-page">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <button onClick={toggleCollapse}>
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
        {/* Add your sidebar content here */}
        <nav>
          <ul>
            <li><a href="#section1">Dashboard</a></li>
            <li>
              <a href="#section2" onClick={toggleSubcategories}>Categories</a>
              <ul
                className={`subcategories ${showSubcategories ? 'open' : ''}`}
                ref={subcategoriesRef}
                style={{marginTop:'5px'}}
              >
                <li className='sidebar-item'><a href='personal-passwords'>Personal</a></li>
                <li className='sidebar-item'><a href='professional-passwords'>Professional</a></li>
                <li className='sidebar-item'><a href='financial-passwords'>Financial</a></li>
                <li className='sidebar-item'><a href='entertainment-passwords'>Entertainment</a></li>
                <li className='sidebar-item'><a href='travel-passwords'>Travel</a></li>
                <li className='sidebar-item'><a href='education-passwords'>Education</a></li>
                <li className='sidebar-item'><a href='security-passwords'>Security</a></li>
                <li className='sidebar-item'><a href='miscellaneous-passwords'>Miscellaneous</a></li>
              </ul>
            </li>
            <li><a href="#section3" onClick={toggleEntryPop1}>New Entry</a></li>
            <li><a href="#section4">Help</a></li>
          </ul>
        </nav>
      </div>
      <div className="content">
        <div className='dashboard'>
          
        </div>

        {isEntryPop && (
          <AddPasswordPopup onClose={toggleEntryPop1} onSubmit={handlePassSubmit} />
        )}

        
        <div className='password-search'>
          <div>
            <button onClick={toggleEntryPop1}>New Password</button>
          </div>
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div class="toggle-switch">
            <input type="checkbox" id="toggle" class="toggle-input"/>
            <label npm for="toggle" class="toggle-label">
              <span class="toggle-text">Categories</span>
              <span class="toggle-text">Show All</span>
              <div class="toggle-handle"></div>
            </label>
          </div>
        </div>

        <div className='big-password-container'>
          <div className='category-title'>Personal</div>

          {managed_apps_keys.map((app, index) => (
            
            <div style={{width:'100%', alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'}} key={index}>
              
              {isDeleteSure && (
                <DeletePopup onClose={toggleDeletePop} onSubmit={(e) => handlePassDelete(app, e)} />
              )}

              
              <div className={`small-password-container ${showDetails && (activeIndex === index - 1)? 'expanded' : ''}`} onClick={() => SmallPassFuncs(app, index)}>
                <div className="password-row">
                  <input 
                    type="checkbox" 
                    className="select-box"
                  />
                  <span className="star-box">★</span>
                  <span className="delete-box" onClick={(e) => {
                    e.stopPropagation();
                    toggleDeletePop();
                  }}>🗑️</span>
                  {/* <img src={`/path/to/logo/${app}.png`} alt={`${app} logo`} className="app-logo"/> */}
                  <span className="app-name">{app}</span>
                  <span className="username">user/email: <b>nickk@gmail.com</b></span>
                  <span className='password-last-changed'>Last Changed: {date_changed}</span>
                  <span className='password-added-date'>Added: {date_added}</span>
                </div>
              </div>
              {showDetails && activeIndex === index && (
                <div
                  className={`password-details ${isExiting ? 'password-details-exit' : 'password-details-enter'}`}
                >
                  <div style= {{paddingLeft:'25%'}}> Password: {showPass ? currentPass : '  ********' }</div>
                  <div style={{display: 'flex', marginLeft: 'auto'}}>
                    <button onClick={toggleShowPass}>{showPass ? 'Hide' : 'Show'}</button>
                    <button>Edit</button>
                    <button>Copy</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        
        <div className='big-password-container'>
          <div className='category-title'>Professional</div>
        </div>
        
        <div className='big-password-container'>
          <div className='category-title'>Financial</div>
        </div>

        <div className='big-password-container'>
          <div className='category-title'>Entertainment</div>
        </div>

        <div className='big-password-container'>
          <div className='category-title'>Travel</div>
        </div>

        <div className='big-password-container'>
          <div className='category-title'>Education</div>
        </div>

        <div className='big-password-container'>
          <div className='category-title'>Security</div>
        </div>

        <div className='big-password-container'>
          <div className='category-title'>Miscellaneous</div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
