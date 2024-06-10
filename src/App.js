import React, { useContext } from 'react';
import './App.css';
import LoginContainer from './Components/Containers/LoginContainer.js';
import CreateContainer from './Components/Containers/CreateContainer.js';
import HomeContainer from './Components/Containers/HomeContainer.js';
import WelcomeContainer from './Components/Containers/WelcomeContainer.js';
import { Account, AccountContext } from './SessionsAccount/Account.js';
import Status from './SessionsAccount/Status.js';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import PrivateRoutes from './SessionsAccount/PrivateRoutes.js';
import { useEffect } from 'react';



function App() {
  

  return (
    <Router>
      <div className="App">
        <Account>
          <Status/>
          <Routes>
            <Route index element={<LoginContainer />} />
            <Route path="/login" element={<LoginContainer />} />
            <Route path="/create-account" element={<CreateContainer />}/>
            <Route element={<PrivateRoutes/>}>
              <Route element={<WelcomeContainer />} path = '/welcome' exact/>
              <Route element={<HomeContainer />} path = '/home' exact/>
            </Route>
          </Routes>
        </Account>
      </div>
    </Router>
  );
}

export default App;
