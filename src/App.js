import React from 'react';
import './App.css';
import LoginPage from './Components/Pages/Login.js';

function App() {
  // Define functions for handling login and sign-up actions
  const handleLogin = (username, password) => {
    // Logic for handling login
    console.log('Logging in with username:', username, 'and password:', password);
  };

  const handleSignUp = () => {
    // Logic for handling sign-up
    console.log('Navigating to sign-up page or performing sign-up logic');
  };

  return (
    <div className="App">
      <main>
        {/* Render the LoginPage component */}
        <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} />
      </main>
      <footer>
        {/* Include any footer content here */}
      </footer>
    </div>
  );
}

export default App;
