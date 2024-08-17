import React, { useState } from 'react';
import './chat_person.css';
import { IoSend } from "react-icons/io5";
import { RiAttachmentLine } from "react-icons/ri";

const ChatPerson = ({ personName }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  const handleAttachFile = () => {
    console.log('Attach file clicked');
    // Implement your file attachment logic here
  };

  return (
    <div className="chat-person-container">
      <div className="chat-header-1">
        <h3>{personName}</h3>
      </div>
      <div className="chat-messages">
        {/* Messages would be displayed here */}
      </div>
      <div className="chat-input">
        <button className="attach-button" onClick={handleAttachFile} style={{width: '5px'}}>
          <RiAttachmentLine style={{color: 'white', marginLeft: '-10px'}} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{color: 'white', width: '100%'}}
        />
        <button className="send-button" onClick={handleSendMessage} style={{width: '5px'}}>
          <IoSend style={{color: 'white', marginLeft: '-10px'}}  />
        </button>
      </div>
    </div>
  );
};

export default ChatPerson;
