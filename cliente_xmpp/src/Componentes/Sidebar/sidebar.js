import React, { useState } from 'react';
import './sidebar.css';
import { AiFillPlusSquare } from "react-icons/ai";
import { FaUser } from "react-icons/fa";


const Sidebar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleAvatarClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="sidebar">
      <div className="icon contact-icon">
        <AiFillPlusSquare style={{width: '180%', height: '180%', marginLeft: '-15px'}} />
      </div>
      
      <div className="avatar-section" onClick={handleAvatarClick}>
        <FaUser style={{width: '180%', height: '180%', marginLeft: '-8px', marginTop: '-15px', color: 'white'}} />
        {isDropdownVisible && (
          <div className="dropdown-menu">
            <button>Cerrar Sesión</button>
            <button>Salir</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
