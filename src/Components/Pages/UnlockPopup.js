import React, { useState } from 'react';
import "./Popup.css";
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

const UnlockPopup = ({ onClose, onSubmit, salt, hash, encryptionKey, setEncryptionKey}) => {
  const deriveKey = (masterPassword, salt) => {
    return CryptoJS.PBKDF2(masterPassword, salt, {
      keySize: 256/32,
      iterations: 10000
    }).toString();
  };

  var [masterHash, setMasterHash] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault();
    //REHASH master
    setEncryptionKey(deriveKey(masterHash, salt));
    masterHash = await bcrypt.hash(masterHash, salt);
    console.log(masterHash == hash);
    onSubmit(masterHash == hash, encryptionKey)
  };


  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Enter Master Password to Unlock Vault</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="popup-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="master-input">Master Password</label>
              <input
                type="password"
                id="master-input"
                value={masterHash}
                onChange={(e) => setMasterHash(e.target.value)}
                placeholder='i hope you remember this'
                required
              />
            </div>
            <div className="popup-actions">
              <button type="submit" className="confirm-button">Unlock</button>
              <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnlockPopup;