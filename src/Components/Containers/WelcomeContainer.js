import React from "react";
import WelcomePage from '../Pages/WelcomePage';
import { useNavigate } from 'react-router-dom'; 
import applications from "./applications";
import axios from "axios";

const WelcomeContainer = () => {
  const navigate = useNavigate();

  const handleSubmitClick = async (selectedApps) => {
    try{
      console.log(selectedApps);
      const token = localStorage.getItem('token');
      console.log("token", token);
      await axios.post('http://localhost:3001/api/add-first-managed', {selectedApps}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // if(response.data[0] > 0){
      //   navigate('/home');
      // }

    }catch (err){
      console.log("Error submitting first managed apps: ", err);
    }
  };

  return <WelcomePage applications={applications} onSubmitClick={handleSubmitClick}/>;
};


export default WelcomeContainer;
