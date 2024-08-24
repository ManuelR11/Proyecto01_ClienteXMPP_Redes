import React, { useState, useEffect, useRef } from 'react';
import './chat_person.css';
import Mensaje from '../Mensaje/mensaje.js';
import { IoSend } from "react-icons/io5";
import { RiAttachmentLine } from "react-icons/ri";

const ChatPerson = ({ personName, onSendmessages, newMessages, onSendFile }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (newMessages && newMessages.length > 0) {
      const formattedMessages = newMessages.map((msg) => ({
        text: msg.message,
        esMio: msg.direction,
        personName: msg.from,
      }));
      setMessages(formattedMessages);
    }
  }, [newMessages]);

  useEffect(() => {
    setMessages([]); // Limpia mensajes cuando cambia personName
  }, [personName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { text: message, esMio: true };
      setMessages([...messages, newMessage]);
      setMessage('');
      onSendmessages(message);

      if (selectedFile) {
        onSendFile(selectedFile); // Envía el archivo seleccionado
        setSelectedFile(null); // Reset file after sending
      }
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Guarda el archivo seleccionado en el estado
      setMessage(file.name); // Muestra el nombre del archivo en el campo de mensaje
    }
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
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <button className="attach-button" onClick={handleAttachFile} style={{ width: '5px' }}>
          <RiAttachmentLine style={{ color: 'white', marginLeft: '-10px' }} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ color: 'white', width: '100%' }}
        />
        <button className="send-button" onClick={handleSendMessage} style={{ width: '5px' }}>
          <IoSend style={{ color: 'white', marginLeft: '-10px' }} />
        </button>
      </div>
    </div>
  );
};

export default ChatPerson;
