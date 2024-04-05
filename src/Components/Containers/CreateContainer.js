// CreateContainer.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateAccPage from '../Pages/CreateAccPage.js';

const CreateContainer = () => {
  const navigate = useNavigate();

  const handleCreateAccount = (username, password) => {
    console.log('Creating account with username:', username, 'and password:', password);
    // Logic for creating an account
    // For simplicity, let's just navigate back to the login page after creating an account
    navigate('/login');
  };

  return <CreateAccPage onCreateClick={handleCreateAccount} />;
};

export default CreateContainer;
