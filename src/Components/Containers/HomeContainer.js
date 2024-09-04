
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
  
      setAppsMap(result[0]);
      //testing appsmap result
      // for(let i =  0; i < Object.entries(appsMap).length; i++){
      //  console.log(appsMap)
      // }

    }).catch(error => {
      // Handle error here
      console.error(error);
    });
  
    // console.log("APPS", Object.keys(appsMap))
  }, [appsMap]);
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

      setAppsMap(prevState => ({
        ...prevState,
        [application]: { app_user, encryptedPass }
      }));
      // console.log("RESPONSE", response.data[0]);
      return response.data
      
    }catch (err){
      console.log("Error submitting passwords", err);
    }
  }

  

  const handlePassDelete = async (app_obj, pass_id, application_name) => {
    try{
      const token = localStorage.getItem('token');
      // console.log("trying this with 'application_id':  ", application_id, "and the name being", application_name);
      await axios.post('http://localhost:3001/api/delete-password', {pass_id, application_name}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setAppsMap(prevState => {
        const newState = { ...prevState };
        delete newState[app_obj];
        return newState;
      });

    }catch (err){
      console.log("Error deleting password: ", err);
    }
  }
  const handlePassUpdate = async (pass_id, application_name, updatedData) => {
    try{
      const token = localStorage.getItem('token');
      const { oldUsername, oldPassword, username, password } = updatedData;
      // console.log("new data: ", updatedData)
      // console.log("Going from ", oldUsername, "to ", newUsername);
      let new_user = username;
      let new_pass = password;
      await axios.post('http://localhost:3001/api/update-password', {pass_id, application_name, new_user, new_pass}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

    } catch (err){
      console.log("Error updating password: ", err);
    }
  }

  return <HomePage managed_apps={appsMap} onPassSubmit={handlePassSubmit} onPassDelete={handlePassDelete} onPassUpdate={handlePassUpdate}/>;
};


export default HomeContainer;