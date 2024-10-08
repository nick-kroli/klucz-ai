import React, {createContext} from "react";
// import Pool from "../Cognito/UserPool";
// import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import useAuth from "../hooks/useAuth";
const AccountContext = createContext();
const SECRET_KEY = 'iamcurrentlyinamilanhotelroom';


const Account = (props) => {

  const {auth, setAuth, newUser, setNewUser} = useAuth();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  // GET SESSION BEFORE BACK END
  // const getSession = async () => {
  //   return await new Promise((resolve, reject) => {
  //     // console.log("GET SESSION WORKING");
  //     const user = Pool.getCurrentUser();
  //     if (user) {
  //       user.getSession((err, session) => {
  //         if (err){
  //           reject(err);
  //         }
  //         else{
  //           resolve(session);
  //         }
  //       });
  //     }
  //     else{
  //       console.log("logged out detected")
  //     }
  //   });
  // }


  const getSession = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getSession');
      return response.data;
    }catch (err){
      console.error("Error fetching session: ", err);
      throw err;
    }
  };

  // AUTHENTICATE PRE BACKEND
  // const authenticate = async (Username, Password, setErrMess) => {
  //   return await new Promise ((resolve, reject) => {
  //     const user = new CognitoUser({Username,Pool}); 
  //     const authDetails = new AuthenticationDetails({Username,Password});
    
  //     user.authenticateUser(authDetails, {
  //       onSuccess: (data) => {
  //         console.log("onSuccess: ", data);
  //         navigate('/home');
  //         resolve(data);
  //       },
  //       onFailure: (err) => {
  //         console.error("onFailure: ", err);
  //         if(err.message === "Missing required parameter USERNAME" || err.message === "Missing required parameter PASSWORD"){
  //           setErrMess("Missing username or password")
  //         }else if(err.message === "Incorrect username or password."){
  //           setErrMess("Invalid username or password");
  //         }
  //         reject(err);
  //       },
  //       newPasswordRequired: (data) => {
  //         console.log("newPasswordRequired: ", data);
  //         resolve(data)
  //       }
  //     });
  //   }); 
  // };


  const authenticate = async(Username, Password, setErrMess) => {
    try{
      console.log("trying api url: ", apiUrl);
      const response = await axios.post('http://localhost:3001/api/authenticate', {Username, Password});
      // console.log("onSuccess: ", response.data);
      const [session, token, new_user] = response.data;
      console.log("FLAG: ", new_user);
      setNewUser(new_user);
      // console.log("DECODED TOKEN1, ", token);
      const decodedToken = jwtDecode(token);
      // console.log("DECODED TOKEN2: ", decodedToken);
      localStorage.setItem('token',token);
      return response.data;
    } catch (err){
      console.error("onFailure: ", err);
      setErrMess(err.response.data.message);
      throw err;
    }
  };

  const logout = async () => {
    try{
      const token = localStorage.getItem('token');
      if(token){
        // console.log("token exists");
      }
      await axios.post('http://localhost:3001/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      console.log("logging out");
      navigate("/login");
      
    }catch (err){
      console.error("Error during logout: ", err);
    }
  };
  
  return (
    <AccountContext.Provider value={{authenticate, getSession, logout}}>
      {props.children}
    </AccountContext.Provider>
  )

}

export {AccountContext, Account};