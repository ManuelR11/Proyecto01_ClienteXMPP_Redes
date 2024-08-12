import React from 'react';
import './users.css';
import { MdSupervisedUserCircle } from "react-icons/md";

const Users = ({ avatarUrl, userName }) => {
    return (
        <button className="user-profile">
            <MdSupervisedUserCircle className="user-avatar" />
            <span className="user-name">{userName}</span>
        </button>
    );
};

export default Users;
