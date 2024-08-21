import React, { useState } from 'react';
import './login.css';
import { client } from '@xmpp/client';
import { xml } from '@xmpp/client'; // Asegúrate de importar xml

function Login({ onSignIn }) {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false); // Estado para el mensaje de error

  const adminUser = 'rod21509-test'; // Cambia esto por el usuario administrador real
  const adminPassword = '123456789'; // Cambia esto por la contraseña del administrador

  const handleSignUpClick = () => {
    setRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setRightPanelActive(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del botón

    const xmppClient = client({
      service: 'ws://alumchat.lol:7070/ws/',
      domain: 'alumchat.lol',
      username: user,
      password: password,
    });

    xmppClient.on('error', err => {
      console.error('❌', err.toString());
      setPasswordError(true); // Mostrar el mensaje de error
    });

    xmppClient.on('online', address => {
      const presence = xml('presence', {}, xml('show', {}, 'chat'), xml('status', {},'Disponible'));
      xmppClient.send(presence);
      localStorage.setItem('user', user);
      console.log('🟢', 'Logged in as', address.toString());
      console.log('user:', user);
      localStorage.setItem('password', password);
      console.log('password:', password);
      setPasswordError(false); // Ocultar el mensaje de error si es exitoso
      onSignIn(); // Llamar la función para remover el componente Login
      xmppClient.stop();
    });

    try {
      await xmppClient.start();
    } catch (err) {
      console.error('❌', err.toString());
      setPasswordError(true); // Mostrar el mensaje de error en caso de excepción
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const newUser = event.target.username.value;
    const newPassword = event.target.passwordRegister.value;

    const xmppClient = client({
      service: 'ws://alumchat.lol:7070/ws/',
      domain: 'alumchat.lol',
      username: adminUser,
      password: adminPassword,
    });

    xmppClient.on('error', err => {
      console.error('❌', err.toString());
    });

    xmppClient.on('online', async () => {
      console.log('🟢', 'Logged in as admin to register new user');

      try {
        const registerIQ = xml(
          'iq',
          { type: 'set', id: 'register1' },
          xml('query', { xmlns: 'jabber:iq:register' },
            xml('username', {}, newUser),
            xml('password', {}, newPassword)
          )
        );

        const response = await xmppClient.send(registerIQ);

        if (response) {
          console.log('🟢 Server response:', response.toString());
        } else {
          console.warn('⚠ No response from server or empty response');
        }

        console.log('🟢 Registered new user:', newUser);
        xmppClient.stop();
        console.log('🔴 Disconnected from server');
      } catch (err) {
        console.error('❌ Error registering new user:', err.toString());
      }
    });

    try {
      await xmppClient.start();
      setRightPanelActive(false); // Volver al panel de inicio de sesión después del registro
    } catch (err) {
      console.error('❌ Error starting XMPP client:', err.toString());
    }
    
  };

  return (
    <div className={`container ${rightPanelActive ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container" style={{ background: '#D9E0ED' }}>
        <form onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <input type="text" placeholder="User" name="username" />
          <input type="password" placeholder="Password" name="passwordRegister" />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container" style={{ background: '#D9E0ED' }}>
        <form onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <input 
            type="text" 
            placeholder="User" 
            name="user" 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button style={{ marginTop: '5px' }} type="submit">Sign In</button>
          {passwordError && <p style={{ color: '#0d121c', marginTop: '10px' }}>Usuario o contraseña incorrectos, vuelva a intentar.</p>}
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>Para seguir conectado debes regresar e ingresar tu información personal</p>
            <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello!</h1>
            <p>Si todavía no tienes una cuenta, puedes crearla aquí</p>
            <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
