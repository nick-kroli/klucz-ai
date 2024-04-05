// CreateContainer.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateAccPage from '../Pages/CreateAccPage.js';
import UserPool from '../../Cognito/UserPool.js';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
const CreateContainer = () => {
  const navigate = useNavigate();

  const handleCreateAccount = (username, password, email) => {
    console.log('Creating account with username:', username, 'and password:', password, 'and email:', email);
    // Logic for creating an account
    const emailAttribute = new CognitoUserAttribute({Name:'email', Value: email})
    const attributeList = [emailAttribute]
    UserPool.signUp(username, password, attributeList, null, function(err, result) {
      if (err) {
          console.error('Error signing up:', err);
          return;
      }
      console.log('User signed up successfully:', result.user);
  });
    // For simplicity, let's just navigate back to the login page after creating an account
    navigate('/login');
  };

  return <CreateAccPage onCreateClick={handleCreateAccount} />;
};

export default CreateContainer;
