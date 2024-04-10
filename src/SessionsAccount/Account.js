import React, {createContext} from "react";
import Pool from "../Cognito/UserPool";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { useNavigate} from 'react-router-dom'; // Import useHistory for navigation

const AccountContext = createContext();

const Account = (props) => {
  const navigate = useNavigate();
  console.log("rendering account ")
  const authenticate = async (Username, Password) => {
    return await new Promise ((resolve, reject) => {
      const user = new CognitoUser({Username,Pool});
      
      const authDetails = new AuthenticationDetails({Username,Password});
    
      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log("onSuccess: ", data);
          navigate('/home')
          resolve(data)
        },
        onFailure: (err) => {
          console.error("onFailure: ", err);
          reject(err)
        },
        newPasswordRequired: (data) => {
          console.log("newPasswordRequired: ", data);
          resolve(data)
        }
      });
    });
    
  }
  return (
    <AccountContext.Provider value={{authenticate}}>
      {props.children}
    </AccountContext.Provider>
  )

}

export {AccountContext, Account};