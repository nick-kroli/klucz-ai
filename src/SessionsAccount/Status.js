import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./Account";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import useAuth from "../hooks/useAuth";
import Navbar from "./Navbar";

const Status = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getSession, logout } = useContext(AccountContext);
  const {auth, setAuth, newUser, setNewUser} = useAuth(); 

  //this useEffect is such a finicky little bastard, keep an eye on dependency array and specifically what the hook sets looks like.
  useEffect(() => {
    const fetchSession = async () => {
      try {
        await getSession();
        // console.log("setting status to true");
        setAuth(true); // Set auth to true if session is successfully fetched
      } catch (error) {
        // console.error("Error fetching session:", error);
        setAuth(false);
      }
    };
    fetchSession();
  }, [newUser, getSession, auth, sessionStorage]); // Only run effect when getSession changes

  const handleLogout = async () => {
    logout();
    console.log("setting status to false");
    setAuth(false);
    setNewUser(null); // null was better for useEffect
  };


  //Redirect to home page if authenticated
  useEffect(() => {
    console.log("AUTH: ", auth, "NEW FLAG: ", newUser);
    if (auth && (location.pathname === "/login" || location.pathname === "/")) {
      navigate(newUser ? "/welcome" : "/home");
    }

  }, [auth, newUser]);

  
  
  return (
   <div>
      {!newUser && auth && <Navbar handleLogout={handleLogout} />}
    </div>


    // <div class="navbar">

    //   <div class="navbar__left">
    //     <button class="navbar__button">Account</button>
    //     <button class="navbar__button" onClick={handleLogout}>Logout</button>
    //   </div>
    //   <div class="navbar__right">
    //     <button class="navbar__button">Generator</button>
    //     <button class="navbar__button">Manager</button>
    //   </div>
    // </div>
  );
};

export default Status;
