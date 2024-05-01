// LoginContainer.js

import React from 'react';
import {useNavigate} from 'react-router-dom'; // Import useHistory for navigation
import { useContext } from 'react';
import LoginPage from '../Pages/Login.js';
import UserPool from '../../Cognito/UserPool.js';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { Account, AccountContext } from '../../SessionsAccount/Account.js';
import { useState } from 'react';
const LoginContainer = () => {
  const { authenticate, getSession } = useContext(AccountContext)
  const [errMess, setErrMess] = useState("");
  const navigate = useNavigate();
  const handleLogin = (username, password) => {
    console.log('Logging in with username:', username, 'and password:', password);

    authenticate(username, password, setErrMess)
    .then(data => {
      console.log("Logged in!", data);
    })
    .catch(err => {
      console.log("ERROR: ", errMess)
      console.error("Failed to login", err);
    });
    
  };

  const handleCreateAccount = () => {
    console.log('Navigating to create account page');
    // Navigate to CreateAccount page
    navigate('/create-account'); 
  };

  return <LoginPage onLogin={handleLogin} onCreateAccount={handleCreateAccount} errorMess={errMess}/>;
};

export default LoginContainer;
