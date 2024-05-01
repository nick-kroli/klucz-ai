import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./Account";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import useAuth from "../hooks/useAuth";

const Status = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getSession, logout } = useContext(AccountContext);
  const {auth, setAuth} = useAuth(); 

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        console.log("setting status to true");
        setAuth(true); // Set auth to true if session is successfully fetched
      } catch (error) {
        console.error("Error fetching session:", error);
        setAuth(false);
      }
    };

    fetchSession();
  }, [getSession, auth]); // Only run effect when getSession changes

  const handleLogout = async () => {
    await logout();
    console.log("setting status to false");
    setAuth(false);
  };

  // Redirect to home page if authenticated
  useEffect(() => {
    if (auth && location.pathname === "/login") {
      navigate("/home");
    }
  }, [auth, location.pathname, navigate]);

  return (
    <div style={{ fontSize: "24px" }}>
      {auth && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
};

export default Status;
