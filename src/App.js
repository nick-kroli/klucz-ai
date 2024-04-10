import React from 'react';
import './App.css';

import LoginContainer from './Components/Containers/LoginContainer.js';
import CreateContainer from './Components/Containers/CreateContainer.js';
import HomeContainer from './Components/Containers/HomeContainer.js';
import {Account, AccountContext} from './SessionsAccount/Account.js'
import {
  BrowserRouter as Router,
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom";

function App() {

  return (
    <Router>
      <div className="App">
      <Account>
        <Routes>
            <Route index element={<LoginContainer />} />
            <Route path="/login" element={<LoginContainer />} />
            <Route path="/create-account" element={<CreateContainer />} />
            <Route path="/home" element={<HomeContainer />} />
        </Routes>
      </Account>
      </div>
    </Router>
  );

  
}

export default App;
