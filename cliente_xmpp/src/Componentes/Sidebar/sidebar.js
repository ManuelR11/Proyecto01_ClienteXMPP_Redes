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
        <AiFillPlusSquare />
      </div>
      
      <div className="avatar-section" onClick={handleAvatarClick}>
        <FaUser />
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
