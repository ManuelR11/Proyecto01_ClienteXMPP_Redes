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

  const addContact = async (username) => {
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

    xmppClient.on('online', async () => {
      console.log('🟢 Conectado como', xmppClient.jid.toString());

      try {
        const addContactIQ = xml(
          'iq',
          { type: 'set', id: 'addContact1' },
          xml('query', { xmlns: 'jabber:iq:roster' },
            xml('item', { jid: `${username}@alumchat.lol`, name: username })
          )
        );

        await xmppClient.send(addContactIQ);
        const subscribePresence = xml(
          'presence',
          { type: 'subscribe', to: `${username}@alumchat.lol` }
        );

        await xmppClient.send(subscribePresence);
        console.log('🟢 Contacto agregado:', username);
        fetchContacts();
      } catch (err) {
        console.error('❌ Error al agregar contacto:', err.toString());
      } finally {
        xmppClient.stop();
      }
    });

    try {
      await xmppClient.start();
    } catch (err) {
      console.error('❌ Error al iniciar el cliente XMPP:', err.toString());
    }
  };

  const handleAddContact = async (username) => {
    await addContact(username);
    console.log('Nuevo contacto agregado:', username);
  };

  return (
    <div id="computer-screen">
      <Navbar />
      {isLoginVisible && <Login onSignIn={handleSignIn} />}
      {!isLoginVisible && (
        <div className="chat-layout">
          <Sidebar onLogout={handleLogout} onAddContact={handleAddContact} /> {/* Pasa la función como prop */}
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
