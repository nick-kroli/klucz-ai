import React, { useState, useEffect, useRef, useMemo } from 'react';
import Sidebar from './Sidebar';
import './HomePage.css';
import AddPasswordPopup from './AddPasswordPopup';
import DeletePopup from './DeletePopup';
import applications from '../Containers/applications';
import UpdatePopup from './UpdatePopup';
import UnlockPopup from './UnlockPopup';
import CryptoJS from 'crypto-js';
import PieChartComponent from './PieChartComponent';
import { render } from '@testing-library/react';
import HealthScore from './HealthScore';


const HomePage = ({ managed_apps , onPassSubmit, onPassDelete , onPassUpdate, salt, hash}) => {
  const [isCollapsed, setCollapsed] = useState(true);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const subcategoriesRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEntryPop, setIsEntryPop] = useState(false);
  const [isDeleteSure, setIsDeleteSure] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [currentDeletingApp, setCurrentDeletingApp] = useState(null);
  const [currentUpdatingApp, setCurrentUpdatingApp] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [masterValidated, setMasterValidated] = useState(false);
  const [encKey, setEncKey] = useState("");
  const [decPass, setDecPass] = useState("");
  const [pieData, setPieData] = useState({});

  const toggleCollapse = () => {
    setCollapsed(!isCollapsed);
  };

  const toggleSubcategories = () => {
    setShowSubcategories(!showSubcategories);
  };

  const toggleEntryPop1 = () => {
    setIsEntryPop(!isEntryPop);
    console.log("Pop up: ", isEntryPop);
  }

  const toggleDeletePop = (app = null) => {
    setIsDeleteSure(!isDeleteSure);
    if (app) {
      setCurrentDeletingApp(app);
    }
  };

  const toggleUpdatePop = (app = null) => {
    setIsUpdating(!isUpdating);
    if (app) {
      setCurrentUpdatingApp(app);
      // console.log("HERE THE UPDATING APP IS ", app)
    }
  }

  const toggleUnlockPop = () => {
    console.log(isUnlocking);
    setIsUnlocking(!isUnlocking);
  }

  const handlePassUpdate = (passId, appName, updatedData) => {
    // console.log("ID: ", passId, "UPDATED", updatedData);
    onPassUpdate(passId, appName, updatedData);
    toggleUpdatePop();
  }
  const handlePassSubmit = (formData) => {
    console.log('Form submitted:', formData);
    toggleEntryPop1();
    onPassSubmit(formData);
  };

  const handlePassDelete = (app_obj, passId, appName, e) => {
    //e.stopPropagation();
    // console.log("Deleting password....", passId);
    onPassDelete(app_obj, passId, appName);
    toggleDeletePop(); // Close the popup after deletion
  };

  const handlePassRetrieve = (app_index) => {
    const password = entry_list[app_index];
    setCurrentPass(password);
  }

  const handleMasterValidation = (master_valid) => {
    console.log(master_valid);
    if(master_valid){
      setMasterValidated(true);
    }
    toggleUnlockPop();
  }

  const toggleShowPass = (app) => {
    if(masterValidated){
      console.log("SETS PASSWORD");
      const dec = decryptPassword(app.password, encKey);
      setDecPass(dec);
    }
    setShowPass(!showPass);
  }

  const decryptPassword = (encryptedPassword, encKey) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedPassword, encKey);
    return decrypted.toString((CryptoJS.enc.Utf8));
  }

  useEffect(() => {
    if (subcategoriesRef.current) {
      if (showSubcategories) {
        subcategoriesRef.current.style.maxHeight = `${subcategoriesRef.current.scrollHeight}px`;
      } else {
        subcategoriesRef.current.style.maxHeight = '0px';
      }
    }
  }, [showSubcategories, managed_apps]);
  
  

  const copyClipboard = (text) => {
    navigator.clipboard.writeText(text).then(function() {
      console.log('Copied to clipboard');
    }).catch(function(error) {
      console.error("Error copying text: ", error);
    });
  };

  const toggleSmallPass = (index, category) => {
    setShowPass(false);
    setDecPass("");
    if(!masterValidated){
      console.log("enter your master password to unlock vault!");
      toggleUnlockPop();
    }
    if (activeCategory === category && activeIndex === index) {
      setIsExiting(true);
      setTimeout(() => {
        setActiveCategory(null);
        setActiveIndex(null);
        setIsExiting(false);
        setShowDetails(false);
      }, 350);
    } else {
      setActiveCategory(category);
      setActiveIndex(index);
      setShowDetails(true);
    }
  };

  const SmallPassFuncs = (app, index, category) => {
    toggleSmallPass(index, category);
    handlePassRetrieve(app);

    
  }

  const parseResponse = (managed_apps) => {
    if (!managed_apps || Object.keys(managed_apps).length === 0){
      return [];
    }

    const entryList = [];
    // console.log(managed_apps);
    //console.log(typeof('sec', managed_apps[0]));
    for (const appKey of Object.keys(managed_apps)) {
      const accounts = Array.isArray(managed_apps[appKey]) ? managed_apps[appKey] : [managed_apps[appKey]];
      for (const appAccount of accounts) {
        // console.log(appAccount)
        const newEntry = { "appName": appKey, ...appAccount };
        entryList.push(newEntry);
      }
    }
    return entryList;
  }

  // const updatePieChart = (categorizedApps) => {

  //   setPieData([
  //     { name: 'Group A', value: 400 },
  //     { name: 'Group B', value: 300 },
  //     { name: 'Group C', value: 300 },
  //     { name: 'Group D', value: 200 },
  //   ]);
    
  // }

  const categorizeEntries = (entries) => {
    const categorized = {};
    for (const entry of entries) {
      const category = applications[entry.appName] || "Miscellaneous";
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(entry);
    }
    return categorized;
  }
  
  const entry_list = useMemo(() => parseResponse(managed_apps), [managed_apps]);
  const categorizedApps = useMemo(() => categorizeEntries(entry_list), [entry_list]);
  // const enc_key = "test_enc";
  // console.log(categorizedApps);

  useEffect(() => {
    const renderPieData = {};
    for ( const cat_key of Object.keys(categorizedApps)){
        renderPieData[cat_key] = 0;
        for (const app_user of categorizedApps[cat_key]){
          renderPieData[cat_key] += 1;
        }
    }
    // console.log(renderPieData);
    setPieData(renderPieData);
  }, [categorizedApps])

  return (
    <div className="home-page">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <button onClick={toggleCollapse}>
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
        <nav>
          <ul>
            <li><a href="#section1">Dashboard</a></li>
            <li>
              <a href="#section2" onClick={toggleSubcategories}>Categories</a>
              <ul
                className={`subcategories ${showSubcategories ? 'open' : ''}`}
                ref={subcategoriesRef}
                style={{ marginTop: '5px' }}
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
        <div className='dashboard' style={{ height: '400px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <h3>Password Distribution</h3>
          <PieChartComponent
            data={pieData} 
          />
        </div>
        <div>
          break
        </div>
        <div className='dashboard'  style={{ height: '400px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <h3>Recent Activity</h3>
        </div>
        <div>
          break
        </div>
        <div className='dashboard'  style={{ height: '400px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <h3>Health Overview</h3>
          <HealthScore
            score={20}
          />
        </div>
        

        <div className='password-search'>
          {
            masterValidated ? (
              <div>
                <button onClick={toggleEntryPop1}>New Password</button>
              </div>
            ) : (
              <div>
                <p>Unlock your vault to add/update passwords!</p>
                <button onClick={toggleUnlockPop}>Unlock Vault</button>
              </div>
              
            )

          }
          
          
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {/*
          <div className="toggle-switch">
            <input type="checkbox" id="toggle" className="toggle-input" />
            <label htmlFor="toggle" className="toggle-label">
              <span className="toggle-text">Categories</span>
              <span className="toggle-text">Show All</span>
              <div className="toggle-handle"></div>
            </label>
          </div>
          */}
          <div>Status: {masterValidated ? <span style={{color:'green'}}>Unlocked</span> : <span style={{color:'red'}}>Locked</span>}</div>
        </div>

        {isEntryPop && (
          <AddPasswordPopup onClose={toggleEntryPop1} onSubmit={handlePassSubmit} encryptionKey={encKey}/>
        )}


        {isUnlocking && (
          <UnlockPopup
            onClose={() => toggleUnlockPop()}
            onSubmit={(master_valid) => handleMasterValidation(master_valid)}
            encryptionKey = {encKey}
            setEncryptionKey = {setEncKey}
            salt = {salt}
            hash = {hash}
          />
        )}
       
        {entry_list.length === 0 ? (

            <div className='empty-passwords' style={{height: '300px'}}>
              <h2>Welcome to Your Password Manager!</h2>
              <p>You haven't added any passwords yet. Click the "New Password" button to get started.</p>
            </div>

          ) : (

            

            Object.keys(categorizedApps).map((category) => (
            <div className='big-password-container' key={category}>
              <div className='category-title'>{category}</div>
              {categorizedApps[category].map((app, index) => (
                <div
                  style={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}
                  key={`${category}-${index}`}
                >



                  {isDeleteSure && currentDeletingApp && (
                    <DeletePopup 
                      onClose={() => toggleDeletePop()}
                      onSubmit={(e) => handlePassDelete(currentDeletingApp, currentDeletingApp.pass_id, currentDeletingApp.appName, e)} 
                    />)
                  }

                  {isUpdating && currentUpdatingApp && (
                    <UpdatePopup 
                      onClose={() => toggleUpdatePop()}
                      onSubmit={(updatedData) => handlePassUpdate(currentUpdatingApp.pass_id, currentUpdatingApp.appName, updatedData)}
                      initialUsername={currentUpdatingApp.username}
                      initialPassword={currentUpdatingApp.password}
                      encryptionKey = {encKey}
                    />
                  )}
                  
                  <div
                    className={`small-password-container ${showDetails && (activeCategory === category && activeIndex === index) ? 'expanded' : ''}`}
                    onClick={() => SmallPassFuncs(app, index, category)}
                  >
                    <div className="password-row">
                      <input
                        type="checkbox"
                        className="select-box"
                      />
                      <span className="star-box">★</span>
                      <span className="delete-box" onClick={(e) => {
                        e.stopPropagation();
                        toggleDeletePop(app);
                      }}>🗑️</span>
                      <span className="app-name">{app.appName}</span>
                      <span className="username">user/email: <b>{app.username}</b></span>
                      <span className='password-last-changed'>Last Changed: {app.lastChangedDate}</span>
                      <span className='password-added-date'>Added: {app.dateAdded}</span>
                    </div>
                  </div>
                  {showDetails && activeCategory === category && activeIndex === index && masterValidated && (
                    <div className={`password-details ${isExiting ? 'password-details-exit' : 'password-details-enter'}`}>
                      <div style={{ paddingLeft: '25%' }}> Password: {showPass ? decPass : '  ********'}</div>
                      <div style={{ display: 'flex', marginLeft: 'auto' }}>
                        <button onClick={(e) => {
                          toggleShowPass(app)
                        }}>{showPass ? 'Hide' : 'Show'}</button>
                        <button onClick={(e) => {
                          toggleUpdatePop(app)
                        }}>Edit</button>
                        <button onClick={() => copyClipboard(app.password)}>Copy</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          ))


            
        )
      }

        
      </div>
    </div>
  );
};

export default HomePage;
