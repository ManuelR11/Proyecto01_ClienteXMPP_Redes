import React, { useState, useEffect, useCallback } from 'react';
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
  const [contacts, setContacts] = useState([]); // Estado para los contactos
  const [, setDisponibilidad] = useState(''); // Estado para manejar el status


  useEffect(() => {
    // Función para limpiar localStorage
    const clearLocalStorage = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('password');
    };

    // Verifica si hay un usuario almacenado en localStorage
    const storedUser = localStorage.getItem('user');
    console.log('Stored User:', storedUser);
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsLoginVisible(false);
    }

    // Configura el evento antes de que la página se cierre
    window.addEventListener('beforeunload', clearLocalStorage);

    // Limpia el evento al desmontar el componente
    return () => {
      window.removeEventListener('beforeunload', clearLocalStorage);
    };
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

  const fetchContacts = useCallback(async () => {
    const storedUser = localStorage.getItem('user');
    const storedPassword = localStorage.getItem('password');
    
    if (!storedUser || !storedPassword) return;

    const xmppClient = client({
      service: 'ws://alumchat.lol:7070/ws/',
      domain: 'alumchat.lol',
      username: storedUser,
      password: storedPassword,
    });

    xmppClient.on('error', err => {
      console.error('❌ Error en XMPP client:', err.toString());
    });

    xmppClient.on('stanza', stanza => {
      console.log('🔄 Stanza recibida:', stanza.toString());

      if (stanza.is('iq') && stanza.attrs.id === 'getRoster1' && stanza.attrs.type === 'result') {
        const query = stanza.getChild('query', 'jabber:iq:roster');
        if (!query) {
          console.error('❌ No se encontró el elemento <query> en la respuesta.');
          return;
        }

        const contactsList = query.getChildren('item').map(item => ({
          name: item.attrs.name || item.attrs.jid.split('@')[0],
          jid: item.attrs.jid,
          status: 'Offline'
        }));

        console.log('Contacts:', contactsList);
        setContacts(contactsList);

        xmppClient.stop();
      }
    });

    xmppClient.on('online', async () => {
      console.log('🟢 Conectado como', xmppClient.jid.toString());

      try {
        const getRosterIQ = xml(
          'iq',
          { type: 'get', id: 'getRoster1' },
          xml('query', { xmlns: 'jabber:iq:roster' })
        );

        await xmppClient.send(getRosterIQ);
      } catch (err) {
        console.error('❌ Error al enviar IQ para obtener el roster:', err.toString());
      }
    });

    try {
      await xmppClient.start();
    } catch (err) {
      console.error('❌ Error al iniciar el cliente XMPP:', err.toString());
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchContacts(); // Llamar a fetchContacts cuando el usuario esté conectado
    }
  }, [currentUser, fetchContacts]);

  const handleSignIn = async () => {
    const storedUser = localStorage.getItem('user');
    const storedPassword = localStorage.getItem('password');
    if (storedUser && storedPassword) {
      setCurrentUser(storedUser);
      setIsLoginVisible(false);

      // Iniciar la obtención de contactos
      fetchContacts();
    }
  };

  const handleLogout = async () => {
    if (xmppClient) {
      try {
        xmppClient.send(xml('presence', xml('status', {}, 'Offline')));
        xmppClient.stop();
        console.log('🔴', 'offline');
      } catch (error) {
        console.error('Error stopping XMPP client:', error);
      }
    }
    localStorage.removeItem('user');
    localStorage.removeItem('password');
    setCurrentUser(null);
    setIsLoginVisible(true);  // Vuelve a mostrar el componente de Login
    setXmppClient(null);
    setContacts([]); // Limpiar los contactos al cerrar sesión
  };

  const handleAddContact = (newContact) => {
    setContacts([...contacts, { name: newContact, jid: `${newContact}@alumchat.lol`, status: 'Offline' }]);
    console.log('Nuevo contacto agregado:', newContact);
  };

  const handleDisponibilidadChange = (newDisponibilidad) => {
    setDisponibilidad(newDisponibilidad);  
    console.log(`Disponibilidad en Chat cambiado a: ${newDisponibilidad}`);  
    handleConfirm(newDisponibilidad);  // Pasa el nuevo valor de disponibilidad a handleConfirm
  };
  
  const handleConfirm = async (newDisponibilidad) => {
    const storedUser = localStorage.getItem('user');
    const storedPassword = localStorage.getItem('password');
    const xmppClient = client({
      service: 'ws://alumchat.lol:7070/ws/',
      domain: 'alumchat.lol',
      username: storedUser,
      password: storedPassword,
    });
  
    xmppClient.on('error', err => {
      console.error('❌', err.toString());
    });
  
    xmppClient.on('online', async (address) => {
      console.log('🟢', 'online as', address.toString());
  
      const presence = xml(
        'presence',
        {},
        xml('show', {}, newDisponibilidad)  // Usa el nuevo valor de disponibilidad
      );
  
      try {
        await xmppClient.send(presence);
        console.log('🟢 Status updated successfully');
        console.log('🟢', 'Presence:', presence.toString());
      } catch (err) {
        console.error('❌ Error sending presence:', err.toString());
      }
    });
  
    xmppClient.on('offline', () => {
      console.log('🔴 Disconnected from XMPP server');
    });
  
    try {
      await xmppClient.start();
    } catch (err) {
      console.error('❌ Error starting XMPP client:', err.toString());
    }
  };


  return (
    <div id="computer-screen">
      <Navbar />
      {isLoginVisible && <Login onSignIn={handleSignIn} />}
      {!isLoginVisible && (
        <div className="chat-layout">
          <Sidebar 
            onLogout={handleLogout} 
            onAddContact={handleAddContact} 
            onStatusChange={handleDisponibilidadChange}  // Pasa la función para manejar cambios de status
          />
          <div className="chat-container-users">
            <div className="chat-header">
              <SearchBox placeholder="Buscar..." onSearch={handleSearch} />
            </div>
            {contacts.map(contact => (
              <Users
                key={contact.jid}
                avatarUrl="https://via.placeholder.com/150"
                userName={contact.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
