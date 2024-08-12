import React, { useState, useEffect } from 'react';
import './chat.css';
import Navbar from '../Componentes/navbar/navbar.js';
import Login from '../Componentes/login/login.js';
import Users from '../Componentes/Users/users.js';
import Sidebar from '../Componentes/Sidebar/sidebar.js';
import SearchBox from '../Componentes/Searchbox/searchbox.js';
import { client } from '@xmpp/client';
import { xml } from '@xmpp/client'; // Asegúrate de importar xml

const Chat = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [xmppClient, setXmppClient] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsLoginVisible(false);  // Oculta el Login si el usuario ya está logueado
    }
  }, []);

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

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Aquí puedes manejar la lógica de búsqueda
  };

  useEffect(() => {
    window.addEventListener('resize', adjustScreenSize);
    adjustScreenSize();
    return () => {
      window.removeEventListener('resize', adjustScreenSize);
    };
  }, []);

  const handleSignIn = async () => {
    const storedUser = localStorage.getItem('user');
    const storedPassword = localStorage.getItem('password');
    if (storedUser && storedPassword) {
      setCurrentUser(storedUser);
      setIsLoginVisible(false);

      // Configura el cliente XMPP
      const xmpp = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        username: storedUser,
        password: storedPassword,
      });

      xmpp.on('error', (err) => {
        console.error('XMPP error:', err);
      });

      xmpp.on('offline', () => {
        console.log('🔴', 'offline');
      });

      xmpp.on('online', (address) => {
        console.log('🟢', 'online as', address.toString());
        console.log('XMPP client:', xmpp);
      });

      try {
        await xmpp.start();
        setXmppClient(xmpp);
      } catch (error) {
        console.error('Error starting XMPP client:', error);
      }
    }
  };

  const handleLogout = async () => {
    if (xmppClient) {
      try {
        await xmppClient.stop();
        console.log('🔴', 'offline');
      } catch (error) {
        console.error('Error stopping XMPP client:', error);
      }
    }
    localStorage.removeItem('user');
    localStorage.removeItem('password');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoginVisible(true);  // Vuelve a mostrar el componente de Login
    setCurrentUser(null);
    setXmppClient(null);
  };

  return (
    <div id="computer-screen">
      <Navbar />
      {isLoginVisible && <Login onSignIn={handleSignIn} />}
      {!isLoginVisible && (
        <div className="chat-layout">
          <Sidebar onLogout={handleLogout} /> {/* Pasa la función handleLogout */}
          <div className="chat-container-users">
            <div className="chat-header">
              <SearchBox placeholder="Buscar..." onSearch={handleSearch} />
            </div>
            <Users avatarUrl="https://via.placeholder.com/150" userName="John Doe" />
            <Users avatarUrl="https://via.placeholder.com/150" userName="Jane Doe" />
            <Users avatarUrl="https://via.placeholder.com/150" userName="Sam Smith" />
            <Users avatarUrl="https://via.placeholder.com/150" userName="Jane Doe" />
            <Users avatarUrl="https://via.placeholder.com/150" userName="Sam Smith" />
            <Users avatarUrl="https://via.placeholder.com/150" userName="Jane Doe" />
            <Users avatarUrl="https://via.placeholder.com/150" userName="Sam Smith" />
            <Users avatarUrl="https://via.placeholder.com/150" userName="Jane Doe" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;