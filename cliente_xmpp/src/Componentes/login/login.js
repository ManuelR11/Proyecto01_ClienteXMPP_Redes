import React, { useState } from 'react';
import './login.css';
import { client } from '@xmpp/client';

function Login({ onSignIn }) {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false); // Estado para el mensaje de error

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
      console.log('🟢', 'online as', address.toString());
      localStorage.setItem('user', user);
      localStorage.setItem('password', password);
      setPasswordError(false); // Ocultar el mensaje de error si es exitoso
      onSignIn(); // Llamar la función para remover el componente Login
    });

    try {
      await xmppClient.start();
    } catch (err) {
      console.error('❌', err.toString());
      setPasswordError(true); // Mostrar el mensaje de error en caso de excepción
    }
  };

  return (
    <div className={`container ${rightPanelActive ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container" style={{ background: '#D9E0ED' }}>
        <form action="#">
          <h1>Create Account</h1>
          <input type="text" placeholder="User" />
          <input type="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container" style={{ background: '#D9E0ED' }}>
        <form action="#">
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
          <button style={{ marginTop: '5px' }} type="submit" onClick={handleLogin}>Sign In</button>
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
