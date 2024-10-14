
import React, { useEffect } from 'react';
import HomePage from '../Pages/HomePage';
import { useNavigate} from 'react-router-dom'; 
import axios from 'axios';
import { useState } from 'react';
import { type } from '@testing-library/user-event/dist/type';


const HomeContainer = () => {
  const navigate = useNavigate();
  const [appsMap, setAppsMap] = useState({});
  const [masterValidated, setMasterValidated] = useState(false);
  const [salt, setSalt] = useState('');
  const [hash, setHash] = useState('');
  const [isCallingApi, setIsCallingApi] = useState('');
  const [securityScore, setSecurityScore] = useState(0);

  useEffect(() => {
    console.log('HomeContainer useEffect runs');
    const getAppsList = async () => {
      try{
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3001/api/get-password-info', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response.data
        
      }catch (err){
        console.log("Error getting passwords", err);
      }
    };
  
    getAppsList().then(result => {
      
      setAppsMap(result.managed_apps[0]);
      setSecurityScore(result.security_score);
      
    }).catch(error => {
      console.error(error);
    });
  

  }, [isCallingApi]);


  useEffect(() => {
    const fetchSaltHash = async () => {
      try{
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3001/api/get-salt-hash', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // console.log("SALT_HASH OBJ: ", response.data);

        return response.data
      } catch (err){
        console.log("Error getting salt and hash", err);
      }
    }
    
    fetchSaltHash().then(result => {
      const salt = result['salt'];
      const hash = result['hash'];
      setSalt(salt);
      setHash(hash);
    })
    // console.log('hash: ', hash, 'salt: ', salt);
  }, [isCallingApi]);

  const handlePassSubmit = async (formData) => {
    try{
      
      const token = localStorage.getItem('token');
      // console.log("token", token);
      const application = Object.values(formData)[0];
      const app_user = Object.values(formData)[1];
      const encryptedPass = Object.values(formData)[2];
      const score_info = Object.values(formData)[3];
      const password_score = score_info['score']

      const response = await axios.post('http://localhost:3001/api/add-new-password', {application, app_user, encryptedPass, password_score}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setAppsMap(prevState => ({
        ...prevState,
        [application]: { app_user, encryptedPass }
      }));
      // console.log("RESPONSE", response.data[0]);
      setIsCallingApi('adding');
      return response.data
    }catch (err){
      console.log("Error submitting passwords", err);
    }
  }

  

  const handlePassDelete = async (app_obj, pass_id, application_name) => {
    try{
      console.log('tries to delete');
      
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
      setIsCallingApi('deleting');
    }catch (err){
      console.log("Error deleting password: ", err);
    }
  }
  const handlePassUpdate = async (pass_id, application_name, updatedData) => {
    try{
      
      const token = localStorage.getItem('token');
      const { oldUsername, oldPassword, username, encryptedPass, score_info } = updatedData;
      // console.log("new data: ", updatedData)
      // console.log("Going from ", oldUsername, "to ", newUsername);
      let new_user = username;
      let new_pass = encryptedPass;
      const password_score = score_info['score']
  
      await axios.post('http://localhost:3001/api/update-password', {pass_id, application_name, new_user, new_pass, password_score}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsCallingApi('updating');
    } catch (err){
      console.log("Error updating password: ", err);
    }
  }
  return <HomePage managed_apps={appsMap} onPassSubmit={handlePassSubmit} onPassDelete={handlePassDelete} onPassUpdate={handlePassUpdate} salt={salt} hash={hash} security_score={securityScore}/>;
};


export default HomeContainer;