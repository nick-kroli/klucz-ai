import React from 'react';
import HomePage from '../Pages/HomePage';
import { useNavigate} from 'react-router-dom'; 

const HomeContainer = () => {
  const navigate = useNavigate();

  // const handleLogOut = () => {
  //   console.log('Navigating to login page');
  //   navigate('/login');
  // }

  return <HomePage/>;
};


export default HomeContainer;