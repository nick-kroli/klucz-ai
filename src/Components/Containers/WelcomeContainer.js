import React from "react";
import { useContext } from 'react';

import WelcomePage from '../Pages/WelcomePage';
import { useNavigate } from 'react-router-dom'; 
import applications from "./applications";
import axios from "axios";
import CryptoJS from "crypto-js";
import bcrypt from 'bcryptjs';
import { Account, AccountContext } from '../../SessionsAccount/Account.js';
import useAuth from '../../hooks/useAuth.js';


const WelcomeContainer = () => {
  const navigate = useNavigate();
  const {auth, setAuth, newUser, setNewUser} = useAuth(); 

  const generateSalt = () => {
    return bcrypt.genSaltSync(10);
  };

  const hashMasterPassword = async (masterPassword, salt) => {
    try {
      return await bcrypt.hash(masterPassword, salt);
    } catch (err) {
      console.error('Error hashing password:', err);
      throw err;
    }
  };

  const verifyMasterPassword = async (inputPassword, storedHash) => {
    try {
      return await bcrypt.compare(inputPassword, storedHash);
    } catch (err) {
      console.error('Error verifying password:', err);
      throw err;
    }
  };

  const setupMasterPassword = async (masterPassword) => {
    const salt = generateSalt();
    const hash = await hashMasterPassword(masterPassword, salt);
    
    //DO THIS ONCE VAULT IS UNLOCKED AND PASSWORD IS ADDED
    const encryptionKeySalt = CryptoJS.lib.WordArray.random(16); //QUESTIONABLE HERE???
    const encryptionKey = CryptoJS.PBKDF2(masterPassword, encryptionKeySalt, {//QUESTIONABLE HERE???
      keySize: 32 / 4,  
      iterations: 100000,
      hasher: CryptoJS.algo.SHA512
    });
    
    return {
      salt,
      hash,
      encryptionKey: encryptionKey.toString(CryptoJS.enc.Hex),//QUESTIONABLE HERE???
      encryptionKeySalt: encryptionKeySalt.toString(CryptoJS.enc.Hex)//QUESTIONABLE HERE???
    };
  };

  const handleSubmitClick = async (masterPassword) => {
    try {
      console.log(masterPassword);
      const token = localStorage.getItem('token');
      
      const { salt, hash, encryptionKey, encryptionKeySalt } = await setupMasterPassword(masterPassword); //should only really be pulling the salt and hash here


      const response = await axios.post('http://localhost:3001/api/master-password-init', {
        salt, 
        hash
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if(response){
        console.log('going home');
        navigate('/home');
      }


    } catch (err) {
      console.log("Error adding vault key info to db: ", err);
    }
  };

  return <WelcomePage applications={Object.keys(applications)} onSubmitClick={handleSubmitClick}/>;
};

export default WelcomeContainer;