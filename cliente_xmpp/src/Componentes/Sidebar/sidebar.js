import React, { useState } from 'react';
import './sidebar.css';
import { FaUser } from "react-icons/fa";
import FormDialog from '../NewContact/newcontact.js';
import Status from '../Status/status.js';

const Sidebar = ({ onLogout, onAddContact, onStatusChange }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [status, setStatus] = useState('Chat');

  const handleAvatarClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);  // Update the status based on the menu selection
    console.log(`Status changed to: ${newStatus}`);
    onStatusChange(newStatus);  // Pass the newStatus to the parent component
  };

  return (
    <div className="sidebar">
      <div className="icon contact-icon">
        <FormDialog onAddContact={onAddContact} /> 
      </div>
      <div className="status">
        <Status onStatusChange={handleStatusChange} />  {/* Pass the handleStatusChange function as a prop */}
      </div>
      <div className="avatar-section" onClick={handleAvatarClick}>
        <FaUser 
          style={{width: '180%', height: '180%', marginLeft: '-8px', marginTop: '-15px', color: 'white'}} 
        />
        {isDropdownVisible && (
          <div className="dropdown-menu">
            <button onClick={onLogout}>Cerrar Sesión</button>
            <button>Estado: {status}</button>  {/* Display the current status */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
