import React, { useEffect } from 'react';
import HomePage from '../Pages/HomePage';
import { useNavigate} from 'react-router-dom'; 
import axios from 'axios';
import { useState } from 'react';


const HomeContainer = () => {
  const navigate = useNavigate();
  const [appsMap, setAppsMap] = useState({});
  

  useEffect(() => {
    const getAppsList = async () => {
      try{
        const token = localStorage.getItem('token');
        // console.log("token", token);
        const response = await axios.post('http://localhost:3001/api/get-password-info', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // console.log("RESPONSE", response.data[0]);
        return response.data
        
      }catch (err){
        console.log("Error getting passwords", err);
      }
    };
  
    getAppsList().then(result => {
      // Access result here
  
      console.log("RES", result[0]);
      setAppsMap(result[0]);
    }).catch(error => {
      // Handle error here
      console.error(error);
    });
  
    // console.log("APPS", Object.keys(appsMap))
  }, []);
  // const managed_apps_list = ['app1', 'app2', 'app3', 'app4', 'app5', 'app6', 'app7', 'app8'];

  const handlePassSubmit = async (formData) => {
    try{
      const token = localStorage.getItem('token');
      // console.log("token", token);
      const application = Object.values(formData)[0];
      const app_user = Object.values(formData)[1];
      const encryptedPass = Object.values(formData)[2];
      const response = await axios.post('http://localhost:3001/api/add-new-password', {application, app_user, encryptedPass}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log("RESPONSE", response.data[0]);
      return response.data
      
    }catch (err){
      console.log("Error submitting passwords", err);
    }
  }

  const handlePassDelete = async (application) => {
    try{
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/delete-password', {application}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }catch (err){
      console.log("Error deleting password");
    }
  }

  return <HomePage managed_apps_keys={Object.keys(appsMap)} managed_apps_vals={Object.values(appsMap)} onPassSubmit={handlePassSubmit} onPassDelete={handlePassDelete}/>;
};

//NEXT TASK: BIG CONTAINER EXPANDS WITH NUMBER OF APPS
export default HomeContainer;