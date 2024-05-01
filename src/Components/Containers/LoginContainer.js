// LoginContainer.js

import React from 'react';
import {useNavigate} from 'react-router-dom'; // Import useHistory for navigation
import { useContext } from 'react';
import LoginPage from '../Pages/Login.js';
import UserPool from '../../Cognito/UserPool.js';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { Account, AccountContext } from '../../SessionsAccount/Account.js';

const LoginContainer = () => {
  const { authenticate, getSession } = useContext(AccountContext)
  
  const navigate = useNavigate();
  const handleLogin = (username, password) => {
    console.log('Logging in with username:', username, 'and password:', password);

    authenticate(username, password)
    .then(data => {
      console.log("Logged in!", data);
    })
    .catch(err => {
      console.error("Failed to login", err);
    });
    
  };

  const handleCreateAccount = () => {
    console.log('Navigating to create account page');
    // Navigate to CreateAccount page
    navigate('/create-account'); // Assuming you have set up routing properly
  };

  return <LoginPage onLogin={handleLogin} onCreateAccount={handleCreateAccount} />;
};

export default LoginContainer;
