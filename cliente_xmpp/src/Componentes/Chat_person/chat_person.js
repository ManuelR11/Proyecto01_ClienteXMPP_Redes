import React, { useState } from 'react';
import './chat_person.css';
import Mensaje from '../Mensaje/mensaje.js';
import { IoSend } from "react-icons/io5";
import { RiAttachmentLine } from "react-icons/ri";

const ChatPerson = ({ personName, mensaje, onSendmessages }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Array to store messages

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { text: message, esMio: true };
      const newMessageText = message;
      setMessages([...messages, newMessage]);
      setMessage('');
      onSendmessages(newMessageText);
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
        {messages.map((msg, index) => (
          <Mensaje key={index} mensaje={msg.text} esMio={msg.esMio} />
        ))}
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
