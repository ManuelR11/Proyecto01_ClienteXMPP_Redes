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
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [UsuarioNotification, setUsuarioNotification] = useState(null);
  //const [status, setStatus] = useState('Chat');
  const [, setDisponibilidad] = useState(''); // Estado para manejar el status
  //const [newMessagesrecibe, setNewMessagesrecibe] = useState('');
  //const [newMessage, setNewMessage] = useState('');


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

  const handleSignIn = async () => {
    const storedUser = localStorage.getItem('user');
    const storedPassword = localStorage.getItem('password');
    if (storedUser && storedPassword) {
      setCurrentUser(storedUser);
      setIsLoginVisible(false);
    }
  };

  const handleLogout = async () => {
    if (xmppClient) {
      try {
        await xmppClient.send(xml('presence', xml('status', {}, 'Offline')));
        xmppClient.stop();
        console.log('🔴 Desconectado');
      } catch (error) {
        console.error('Error al detener el cliente XMPP:', error);
      }
    }
    localStorage.removeItem('user');
    localStorage.removeItem('password');
    setCurrentUser(null);
    setIsLoginVisible(true);
    setXmppClient(null);
    setContacts([]);
  };

  const DeleteAcount = async () => {
    if (xmppClient) {
      try {
        const iqStanza = xml(
          'iq',
          { type: 'set', id: 'delete1' },
          xml('query', { xmlns: 'jabber:iq:register' },
            xml('remove')
          )
        );
  
        await xmppClient.send(iqStanza);
        console.log('🔴 Cliente eliminado del servidor');
  
        // Opcional: Detener el cliente después de eliminar la cuenta
        await xmppClient.stop();
        console.log('🟢 Cliente desconectado');
  
      } catch (error) {
        console.error('Error al eliminar el cliente del servidor:', error);
      }
    } else {
      console.log('Cliente XMPP no está inicializado.');
    }
  };
  


  const initializeXmppClient = useCallback(async () => {
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
        console.log('📩 Stanza de tipo mensaje recibida', stanza.toString());
  
        if (!stanza.attrs.type || stanza.attrs.type === 'chat' || stanza.attrs.type === 'normal') {
          const from = stanza.attrs.from;
          const bodyElement = stanza.getChild('body', 'urn:xmpp:bob');
          
          if (bodyElement) {
            const base64Data = bodyElement.getText();
            const mimeType = bodyElement.attrs['mime-type'] || 'application/octet-stream';
  
            // Crear una URL de datos para visualizar el archivo directamente en el navegador
            const fileURL = `data:${mimeType};base64,${base64Data}`;
  
            // Crear un enlace para ver el archivo
            const fileLink = `LINK: "${fileURL}"`;
            console.log('🟢 Enlace de archivo generado:', fileLink);
  
            // Añadir el enlace como un mensaje en el chat
            addMessageToChat(from.split('/')[0], fileLink, false);
          } else {
            const body = stanza.getChildText('body');
            if (body) {
              console.log('🟢 Mensaje de chat recibido:', body);
              addMessageToChat(from.split('/')[0], body, false);
            } else {
              console.log('❌ Mensaje de chat recibido sin cuerpo');
            }
          }
        } else {
          console.log('Mensaje recibido de tipo:', stanza.attrs.type);
        }
      } else if (stanza.is('iq') && stanza.attrs.id === 'getRoster1' && stanza.attrs.type === 'result') {
        const query = stanza.getChild('query', 'jabber:iq:roster');
        const contactsList = query.getChildren('item').map(item => ({
          name: item.attrs.name || item.attrs.jid.split('@')[0],
          jid: item.attrs.jid,
          status: 'Offline',
          customStatus: ''
        }));
        setContacts(contactsList);
      } else if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
        const from = stanza.attrs.from;
        const message = stanza.getChildText('status') || 'Solicitud de contacto';
        console.log('🟢 Solicitud de contacto:', from, message);
  
        setNotifications(prevNotifications => {
          const alreadyExists = prevNotifications.some(notification => notification.from === from);
          if (!alreadyExists) {
            setUsuarioNotification(from.split('@')[0]); // Captura el nombre del usuario desde la dirección XMPP
            return [...prevNotifications, { from, message }];
          }
          return prevNotifications;
        });
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
  
    xmppClient.on('offline', () => {
      console.log('🔴 Cliente XMPP desconectado');
      xmppClient.start().catch(err => console.error('Error al reconectar:', err));
    });
  
    try {
      await xmppClient.start();
      setXmppClient(xmppClient);
    } catch (err) {
      console.error('❌ Error al iniciar el cliente XMPP:', err.toString());
    }
  
    return () => {
      if (xmppClient) {
        xmppClient.stop();
      }
    };
  
  }, []);
  
  
  

  useEffect(() => {
      initializeXmppClient();
  }, [currentUser, initializeXmppClient]);


  const addContact = async (username) => {
    if (!xmppClient) {
      console.error('❌ Error: Cliente XMPP no está inicializado.');
      return;
    }
  
    try {
      const addContactIQ = xml(
        'iq',
        { type: 'set', id: 'addContact1' },
        xml('query', { xmlns: 'jabber:iq:roster' },
          xml('item', { jid: `${username}@alumchat.lol`, name: username })
        )
      );
  
      await xmppClient.send(addContactIQ);
      console.log('🟢 Contacto agregado al roster:', username);
  
      const subscribePresence = xml(
        'presence',
        { type: 'subscribe', to: `${username}@alumchat.lol` }
      );
  
      await xmppClient.send(subscribePresence);
      console.log('🟢 Solicitud de suscripción enviada a:', username);
      
    } catch (err) {
      console.error('❌ Error al agregar contacto:', err.toString());
    }
  };


  const handleDisponibilidadChange = (newDisponibilidad) => {
    setDisponibilidad(newDisponibilidad);  
    console.log(`Disponibilidad en Chat cambiado a: ${newDisponibilidad}`);  
    handleConfirm(newDisponibilidad);  // Pasa el nuevo valor de disponibilidad a handleConfirm
  };


  const handleConfirm = async (newDisponibilidad) => {
    if (xmppClient) {
      const presence = xml(
        'presence',
        {},
        xml('show', {}, newDisponibilidad)
      );
      try {
        await xmppClient.send(presence);
        console.log('🟢 Disponibilidad actualizada:', newDisponibilidad);
      } catch (err) {
        console.error('❌ Error al actualizar disponibilidad:', err.toString());
      }
    }
  };

  const handleConfirmStatusName = async (newStatusName) => {
    if (xmppClient) {
      const presence = xml(
        'presence',
        {},
        xml('status', {}, newStatusName)
      );
      try {
        await xmppClient.send(presence);
        console.log('🟢 Nombre de estado actualizado:', newStatusName);
      } catch (err) {
        console.error('❌ Error al actualizar el nombre del estado:', err.toString());
      }
    }
  };


  const handleUserSelect = (user) => {
    setSelectedUser(user);
    console.log(`Usuario seleccionado: ${user.name}`);
  };

  const handleNotificationResponse = async (response) => {
    if (!UsuarioNotification || !xmppClient) return;

    const presenceStanza = xml(
      'presence',
      {
        to: `${UsuarioNotification}@alumchat.lol`,
        type: response === 'accepted' ? 'subscribed' : 'unsubscribed',
      }
    );

    try {
      await xmppClient.send(presenceStanza);
      console.log(`🟢 Solicitud de contacto ${response === 'accepted' ? 'aceptada' : 'rechazada'} para ${UsuarioNotification}`);
    } catch (err) {
      console.error(`❌ Error al enviar la respuesta de la solicitud de contacto:`, err.toString());
    }

    // Elimina la notificación después de responder
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.from !== `${UsuarioNotification}@alumchat.lol`)
    );
    setUsuarioNotification(null);
  };


  const sendMessages = async (message) => {
    if (!selectedUser || !xmppClient) return;
    
    const messageStanza = xml(
      'message',
      { type: 'chat', to: selectedUser.jid },
      xml('body', {}, message)
    );

    try {
      await xmppClient.send(messageStanza);
      addMessageToChat(selectedUser.jid, message, 'sent');
      console.log('🟢 Mensaje enviado:', message);
    } catch (err) {
      console.error('❌ Error al enviar mensaje:', err.toString());
    }
  };


  const handleFileSend = async (file) => {
    if (!selectedUser || !xmppClient) return;
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result.split(',')[1];
      const mimeType = file.type;
  
      try {
        const fileStanza = xml(
          'message',
          { type: 'chat', to: selectedUser.jid },
          xml('body', { xmlns: 'urn:xmpp:bob', 'mime-type': mimeType }, `${base64Data} mime-type=${mimeType}` )
        );
  
        await xmppClient.send(fileStanza);
        addMessageToChat(selectedUser.jid, `Archivo enviado: ${file.name}`, 'sent');
        console.log('🟢 Archivo codificado enviado:', base64Data);
      } catch (err) {
        console.error('❌ Error al enviar archivo:', err.toString());
      }
    };
  
    reader.readAsDataURL(file);
  };
  


  const addMessageToChat = (jid, message, direction) => {
    setMessages(prevMessages => ({
      ...prevMessages,
      [jid]: [...(prevMessages[jid] || []), { message, direction }]
    }));
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
              onNotificationResponse={handleNotificationResponse}
              UsuarioNotification={UsuarioNotification}
              setStatusName={handleConfirmStatusName}
              DeleteAcount={DeleteAcount}
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
                onSendFile={handleFileSend}
                newMessages={messages[selectedUser.jid] || []}
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
