import React, { useState } from 'react';
import './login.css';
import { client, xml } from '@xmpp/client';
import debug from '@xmpp/debug';

function Login({ onSignIn }) {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUpClick = () => {
    setRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setRightPanelActive(false);
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    onSignIn(); // Llamamos a la función pasada como prop para ocultar el login
  };
  
  const handleLogin = async () => {
    const xmppClient = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        username: user,
        password: password,
    });

    xmppClient.on('error', err => {
        console.error('❌', err.toString());
    });

    xmppClient.on('online', address => {
        console.log('🟢', 'online as', address.toString());
        {/*navigate('/home', { replace: true });*/}
        localStorage.setItem('user', user);
        localStorage.setItem('password', password);
        onSignIn();
    });

    try {
        await xmppClient.start();
    } catch (err) {
        console.error('❌', err.toString());
        }
    };

  return (
    <div className={`container ${rightPanelActive ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container" style={{ background: '#D9E0ED'}}>
        <form action="#">
          <h1>Create Account</h1>
          <input type="text" placeholder="User"/>
          <input type="password" placeholder="Password"/>
          <button>Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container" style={{ background: '#D9E0ED'}}>
        <form action="#">
          <h1>Sign in</h1>
          <input type="text" placeholder="User" name="user" value={user} onChange={(e) => setUser(e.target.value)} />
          <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button style={{marginTop: '5px'}} type="submit" onClick={handleLogin}>Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>Para seguir conectado debes regresa a ingresar tu informacion personal</p>
            <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello!</h1>
            <p>Si todavia no tienes una cuenta, puedes crearla aqui</p>
            <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
