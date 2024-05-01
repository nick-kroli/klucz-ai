import React, {createContext} from "react";
import Pool from "../Cognito/UserPool";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { useNavigate} from 'react-router-dom'; // Import useHistory for navigation

const AccountContext = createContext();

const Account = (props) => {
  const navigate = useNavigate();
  // console.log("rendering account ")

  const getSession = async () => {
    return await new Promise((resolve, reject) => {
      // console.log("GET SESSION WORKING");
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err){
            reject(err);
          }
          else{
            resolve(session);
          }
        });
      }
      else{
        console.log("logged out detected")
      }
    });
  }

  const authenticate = async (Username, Password, setErrMess) => {
    return await new Promise ((resolve, reject) => {
      const user = new CognitoUser({Username,Pool}); 
      const authDetails = new AuthenticationDetails({Username,Password});
    
      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log("onSuccess: ", data);
          navigate('/home');
          resolve(data);
        },
        onFailure: (err) => {
          console.error("onFailure: ", err);
          if(err.message === "Missing required parameter USERNAME" || err.message === "Missing required parameter PASSWORD"){
            setErrMess("Missing username or password")
          }else if(err.message === "Incorrect username or password."){
            setErrMess("Invalid username or password");
          }
          reject(err);
        },
        newPasswordRequired: (data) => {
          console.log("newPasswordRequired: ", data);
          resolve(data)
        }
      });
    }); 
  };

  const logout = () => {
    const user = Pool.getCurrentUser();
    if (user){
      console.log("logging out")
      user.signOut();
      navigate("/login");
    }
    
  };
  
  return (
    <AccountContext.Provider value={{authenticate, getSession, logout}}>
      {props.children}
    </AccountContext.Provider>
  )

}

export {AccountContext, Account};