import React, { useState, useEffect, useRef } from 'react';
import './chat_person.css';
import Mensaje from '../Mensaje/mensaje.js';
import { IoSend } from "react-icons/io5";
import { RiAttachmentLine } from "react-icons/ri";

const ChatPerson = ({ personName, onSendmessages, newMessages }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (newMessages && newMessages.length > 0) {
      const formattedMessages = newMessages.map((msg) => ({
        text: msg.message,
        esMio: msg.direction,
        personName: msg.from,
      }));

      // Replace old messages with the new ones
      setMessages(formattedMessages);
    }
  }, [newMessages]);

  useEffect(() => {
    setMessages([]); // Limpia mensajes cuando cambia personName
  }, [personName]);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { text: message, esMio: true };
      // Keep only the sent message in the state
      setMessages([newMessage]);
      setMessage('');
      onSendmessages(message);
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
        {/* Dummy div to ensure we can scroll to the bottom */}
        <div ref={messagesEndRef} />
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
