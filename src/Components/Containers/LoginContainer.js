// LoginContainer.js

import React from 'react';
import { useNavigate} from 'react-router-dom'; // Import useHistory for navigation
import LoginPage from '../Pages/Login.js';

const LoginContainer = () => {
  const navigate = useNavigate();

  const handleLogin = (username, password) => {
    console.log('Logging in with username:', username, 'and password:', password);
    // Logic for handling login
  };

  const handleSignUp = () => {
    console.log('Navigating to sign-up page or performing sign-up logic');
    // Logic for handling sign-up
  };

  const handleCreateAccount = () => {
    console.log('Navigating to create account page');
    // Navigate to CreateAccount page
    navigate('/create-account'); // Assuming you have set up routing properly
  };

  return <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} onCreateAccount={handleCreateAccount} />;
};

export default LoginContainer;
