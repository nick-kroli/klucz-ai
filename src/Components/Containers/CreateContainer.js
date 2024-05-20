// CreateContainer.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateAccPage from '../Pages/CreateAccPage.js';
import UserPool from '../../Cognito/UserPool.js';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { useState } from 'react';


const CreateContainer = () => {
  const navigate = useNavigate();
  const [errMess, setErrMess] = useState("");

  const handleCreateAccount = (username, password, email) => {
    console.log('Creating account with username:', username, 'and password:', password, 'and email:', email);
    // Logic for creating an account
    const emailAttribute = new CognitoUserAttribute({Name:'email', Value: email})
    const attributeList = [emailAttribute]
    UserPool.signUp(username, password, attributeList, null, function(err, result) {
      if (err) {
        console.error('Error signing UP:', err);
        if(err.message === "Password did not conform with policy: Password must have uppercase characters"){
          setErrMess("Password must have uppercase characters");
        }
        setErrMess(err.message);
        return;
      }
      else{
        navigate('/login');
      }
      console.log('User signed up successfully:', result.user);
  });
    // For simplicity, let's just navigate back to the login page after creating an account
  };

  return <CreateAccPage onCreateClick={handleCreateAccount} errorMess = {errMess}/>;
};

export default CreateContainer;
