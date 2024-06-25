import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = ({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button onClick={() => navigate("/account")}>Account</button>
      </div>
      <div className="navbar-center">
        KLUCZ AI
      </div>
      <div className="navbar-right">
        <ul>
          <li>
            <button onClick={() => navigate("/passmanager")}>PassManager</button>
          </li>
          <li>
            <button onClick={() => navigate("/generator")}>Generator</button>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
