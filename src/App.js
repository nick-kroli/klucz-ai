import React from 'react';
import './App.css';

import LoginContainer from './Components/Containers/LoginContainer.js';
import CreateContainer from './Components/Containers/CreateContainer.js';
import HomeContainer from './Components/Containers/HomeContainer.js';

import {
  BrowserRouter as Router,
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom";

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path = "/" Component={LoginContainer}/>
          <Route path="/login" Component={LoginContainer}/>
          <Route path="/create-account" Component={CreateContainer}/>
          <Route path="/home" Component={HomeContainer}/>
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;
