import React, { useState, useEffect } from 'react';
import './chat.css';
import Navbar from '../Componentes/navbar/navbar.js';
import Login from '../Componentes/login/login.js';
import Users from '../Componentes/Users/users.js';

const Chat = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);

  const adjustScreenSize = () => {
    const screen = document.getElementById('computer-screen');
    const screenWidth = window.innerWidth * 0.9;
    const screenHeight = window.innerHeight * 0.7;

    screen.style.width = `${screenWidth}px`;
    screen.style.height = `${screenHeight}px`;

    if (screenWidth > 1200) {
      screen.style.width = '1000px';
    }

    if (screenHeight > 800) {
      screen.style.height = '800px';
    }

    if (window.innerWidth <= 600) {
      screen.style.width = `${window.innerWidth * 0.95}px`;
      screen.style.height = `${window.innerHeight * 0.8}px`;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', adjustScreenSize);
    adjustScreenSize();
    return () => {
      window.removeEventListener('resize', adjustScreenSize);
    };
  }, []);

  const handleSignIn = () => {
    setIsLoginVisible(false);
  };

  return (
    <div id="computer-screen">
        <Navbar />
        {isLoginVisible && <Login onSignIn={handleSignIn} />}
        {!isLoginVisible && (
            <div className="chat-container-users">
                <Users avatarUrl="https://via.placeholder.com/150" userName="John Doe" />
                <Users avatarUrl="https://via.placeholder.com/150" userName="Jane Doe" />
                <Users avatarUrl="https://via.placeholder.com/150" userName="Sam Smith" />
                <Users avatarUrl="https://via.placeholder.com/150" userName="Jane Doe" />
                <Users avatarUrl="https://via.placeholder.com/150" userName="Sam Smith" />
                <Users avatarUrl="https://via.placeholder.com/150" userName="Jane Doe" />
                <Users avatarUrl="https://via.placeholder.com/150" userName="Sam Smith" />
                <Users avatarUrl="https://via.placeholder.com/150" userName="Jane Doe" />
            </div>  
        )}
    </div>
  );
};

export default Chat;
