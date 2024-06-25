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


  return <HomePage managed_apps_keys={Object.keys(appsMap)} managed_apps_vals={Object.values(appsMap)}/>;
};

//NEXT TASK: BIG CONTAINER EXPANDS WITH NUMBER OF APPS
export default HomeContainer;