import React, { useEffect } from 'react';
import './chat.css';

const Chat = () => {
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

  return (
    <div id="computer-screen">
      {/* Contenido de la pantalla */}
    </div>
  );
};

export default Chat;
