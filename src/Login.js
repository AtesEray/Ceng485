import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Login Details:', { email, password });
    if (email && password) {
      alert('Login Successful!');
      navigate('/');
    } else {
      alert('Please enter your email and password');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Login</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="file-input"
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="file-input"
      />
      <button className="button" onClick={handleLogin}>
        Login
      </button>
      <button className="button secondary" onClick={() => navigate('/register')}>
        Go to Register
      </button>
      <button
      className="button secondary"
      onClick={() => navigate ('/')}
      style={{marginTop:'20px'}}
      >
        Go To Home Page
      </button>
    </div>
  );
}

export default Login;
