import React from 'react';
import './users.css';

const Users = ({ avatarUrl, userName }) => {
    return (
        <button className="user-profile">
            <img src={avatarUrl} alt="User Avatar" className="user-avatar" />
            <span className="user-name">{userName}</span>
        </button>
    );
};

export default Users;
