import React, { useState } from 'react';
import './sidebar.css';
import { FaUser } from "react-icons/fa";
import FormDialog from '../NewContact/newcontact.js';

const Sidebar = ({ onLogout, onAddContact }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleAvatarClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="sidebar">
      <div className="icon contact-icon">
        <FormDialog onAddContact={onAddContact} /> 
      </div>
      
      <div className="avatar-section" onClick={handleAvatarClick}>
        <FaUser 
          style={{width: '180%', height: '180%', marginLeft: '-8px', marginTop: '-15px', color: 'white'}} 
        />
        {isDropdownVisible && (
          <div className="dropdown-menu">
            <button onClick={onLogout}>Cerrar Sesión</button>
            <button>Estado</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

