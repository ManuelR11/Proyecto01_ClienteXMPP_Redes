import React, { useState } from 'react';
import './sidebar.css';
import { FaUser } from "react-icons/fa";
import FormDialog from '../NewContact/newcontact.js';
import Status from '../Status/status.js';
import Notifications_conteiner from '../Notifications/Notifications_conteiner.js';
import FormDialog1 from '../StatusName/statusname.js';

const Sidebar = ({ onLogout, onAddContact, onStatusChange, onNotificationResponse, UsuarioNotification, setStatusName }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [status, setStatus] = useState('Chat');

  const handleAvatarClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onStatusChange(newStatus); 
  };

  const handleNotificationResponse = (response) => {
    onNotificationResponse(response); 
  };

  const onsetStatusName = (newStatusName) => {
    setStatusName(newStatusName); 
  }

  return (
    <div className="sidebar">
      <div className="icon contact-icon">
        <FormDialog onAddContact={onAddContact} /> 
      </div>
      <div className='notifications'>
        <Notifications_conteiner UsuarioNotification={UsuarioNotification} onResponse={handleNotificationResponse} />
      </div>
      <div className="status-name">
        <FormDialog1 onsetStatusName={onsetStatusName} />
      </div>
      <div className="status">
        <Status onStatusChange={handleStatusChange} />
      </div>
      <div className="avatar-section" onClick={handleAvatarClick}>
        <FaUser 
          style={{width: '180%', height: '180%', marginLeft: '-8px', marginTop: '-15px', color: 'white'}} 
        />
        {isDropdownVisible && (
          <div className="dropdown-menu">
            <button onClick={onLogout}>Cerrar Sesión</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
