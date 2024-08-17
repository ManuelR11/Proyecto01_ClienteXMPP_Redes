import React from 'react';
import './users.css';
import { MdSupervisedUserCircle } from "react-icons/md";
import CustomizedDialogs from '../Info_user/info_user.js';

const Users = ({ avatarUrl, userName, jid, disponibilidad, customStatus }) => {
    return (
        <button className="user-profile">
            <MdSupervisedUserCircle className="user-avatar" />
            <span className="user-name">{userName}</span>
            <div className="user-status">
            <CustomizedDialogs
                dialogTitle={userName}
                dialogjid={jid}
                dialogStatus={customStatus}
                dialogDisp={disponibilidad}
            />
            </div>
        </button>
    );
};

export default Users;
