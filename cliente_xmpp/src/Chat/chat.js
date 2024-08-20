import React, { useState, useEffect, useCallback } from 'react';
import './chat.css';
import Navbar from '../Componentes/navbar/navbar.js';
import Login from '../Componentes/login/login.js';
import Users from '../Componentes/Users/users.js';
import Sidebar from '../Componentes/Sidebar/sidebar.js';
import SearchBox from '../Componentes/Searchbox/searchbox.js';
import ChatPerson from '../Componentes/Chat_person/chat_person.js';
import { PiChatCenteredSlashBold } from "react-icons/pi";
import { client } from '@xmpp/client';
import { xml } from '@xmpp/client'; // Asegúrate de importar xml

const Chat = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [xmppClient, setXmppClient] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [contacts, setContacts] = useState([]); // Estado para los contactos
  const [, setDisponibilidad] = useState(''); // Estado para manejar el status
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');


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

      if (stanza.is('message')) {
        console.log('📩 Stanza de tipo mensaje recibida');

        if (!stanza.attrs.type || stanza.attrs.type === 'chat' || stanza.attrs.type === 'normal') {
            const from = stanza.attrs.from;
            const body = stanza.getChildText('body');
            const omemoEvent = stanza.getChild('event', 'http://jabber.org/protocol/pubsub#event');

            if (body) {
                console.log('🟢 Mensaje de chat recibido:', body);
                console.log('De:', from);
                console.log('Cuerpo del mensaje:', body);
                const normalizedName = from.split('/')[0];
                addMessageToChat(normalizedName, body, 'received');
            } else if (omemoEvent) {
                console.log('🔒 Mensaje OMEMO recibido');
                addMessageToChat(from, 'Mensaje OMEMO', 'received');
            } else {
                console.log('❌ Mensaje de chat recibido sin cuerpo');
            }
        } else {
            console.log('Mensaje recibido de tipo:', stanza.attrs.type);
        }
    } else if (stanza.is('iq') && stanza.attrs.id === 'getRoster1' && stanza.attrs.type === 'result') {
        const query = stanza.getChild('query', 'jabber:iq:roster');
        if (!query) {
          console.error('❌ No se encontró el elemento <query> en la respuesta.');
          return;
        }

        const contactsList = query.getChildren('item').map(item => ({
          name: item.attrs.name || item.attrs.jid.split('@')[0],
          jid: item.attrs.jid,
          status: 'Offline',
          customStatus: ''
        }));

        setContacts(contactsList);
    } else if (stanza.is('presence')) {
          const from = stanza.attrs.from.split('/')[0];
          const show = stanza.getChildText('show') || 'chat';
          const status = stanza.getChildText('status') || '';

          setContacts(prevContacts =>
              prevContacts.map(contact =>
                  contact.jid === from ? { ...contact, status: show, customStatus: status } : contact
              )
          );
       }
    });

    xmppClient.on('online', async () => {
      console.log('🟢 Conectado como', xmppClient.jid.toString());
      await xmppClient.send(xml('presence'));

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
      fetchContacts(); // Llamar a fetchContacts cuando el usuario esté conectado
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
    const xmppClient = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        username: storedUser,
        password: storedPassword,
    });

    xmppClient.on('error', err => {
        console.error('❌', err.toString());
    });

    xmppClient.on('online', async () => {
        console.log('🟢', 'online as', xmppClient.jid.toString());

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
}  
  

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


  const handleUserSelect = (user) => {
    setSelectedUser(user); // Establece el usuario seleccionado
    console.log(`Usuario seleccionado: ${user.name}`);
  };

  const sendMessages = async (message) => {
    if (!selectedUser) return;
    const storedUser = localStorage.getItem('user');
    const storedPassword = localStorage.getItem('password');
    console.log('Mensaje a enviar:', message);

    const xmppClient = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        username: storedUser,
        password: storedPassword,
    });

    xmppClient.on('error', err => {
        console.error('❌', err.toString());
    });

    xmppClient.on('online', async () => {
        try {
            const messageStanza = xml(
                'message',
                { type: 'chat', to: selectedUser.jid },
                xml('body', {}, message)
            );

            await xmppClient.send(messageStanza);
            console.log('🟢 Mensaje enviado:', message);
            addMessageToChat(selectedUser.jid, message, 'sent');
        } catch (err) {
            console.error('❌ Error al enviar mensaje:', err.toString());
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

const addMessageToChat = (jid, message, direction) => {
    setMessages(prevMessages => [...prevMessages, { jid, message, direction }]);
    console.log('Mensaje añadido:', { jid, message, direction });
};



  return (
    <div id="computer-screen">
      <Navbar />
      {isLoginVisible && <Login onSignIn={handleSignIn} />}
      {!isLoginVisible && (
        <div className="chat-layout-chat-general">
          <div className="chat-layout">
            <Sidebar 
              onLogout={handleLogout} 
              onAddContact={addContact} 
              onStatusChange={handleDisponibilidadChange} 
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
                  jid={contact.jid}
                  disponibilidad={contact.status}
                  customStatus={contact.customStatus}
                  onUserSelect={handleUserSelect}
                />
              ))}
            </div>
          </div>
          <div className="chat-container-chat">
            {selectedUser ? (
              <ChatPerson 
                personName={selectedUser.name}
                onSendmessages={sendMessages}
                />
            ):
            (
              <div className="chat-person-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="chat-header-1" style={{ backgroundColor: '#121927', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <PiChatCenteredSlashBold style={{width: '40%', height: '40%'}} />
                  <h3>Selecciona un usuario para chatear</h3>
                </div>
              </div>
            )
            }
          </div>
        </div>
      )}
    </div>
  );  
};

export default Chat;
