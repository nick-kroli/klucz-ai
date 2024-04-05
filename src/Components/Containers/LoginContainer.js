// LoginContainer.js

import React from 'react';
import { useNavigate} from 'react-router-dom'; // Import useHistory for navigation
import LoginPage from '../Pages/Login.js';
import UserPool from '../../Cognito/UserPool.js';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const LoginContainer = () => {
  const navigate = useNavigate();

  const handleLogin = (username, password) => {
    console.log('Logging in with username:', username, 'and password:', password);
    // Logic for handling login

      const user = new CognitoUser({
        Username: username,
        Pool: UserPool
      })

      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password
      })
      
      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log("onSuccess: ", data);
          navigate('/home')
        },
        onFailure: (err) => {
          console.error("onFailure: ", err);
        },
        newPasswordRequired: (data) => {
          console.log("newPasswordRequired: ", data);
        }
      })
  };

  const handleCreateAccount = () => {
    console.log('Navigating to create account page');
    // Navigate to CreateAccount page
    navigate('/create-account'); // Assuming you have set up routing properly
  };

  return <LoginPage onLogin={handleLogin} onCreateAccount={handleCreateAccount} />;
};

export default LoginContainer;
