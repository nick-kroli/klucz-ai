import React, { useState } from 'react';
import "./Popup.css";


const DeletePopup = ({ onClose, onSubmit }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Delete Confirmation</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="popup-body">
          <p>Are you sure you want to delete this password?</p>
          <div className="popup-actions">
            <button className="confirm-button" onClick={onSubmit}>Yes</button>
            <button className="cancel-button" onClick={onClose}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;