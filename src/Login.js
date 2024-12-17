import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        navigate(`/${data.role}-home`);
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong.');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Login</h2>
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
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
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="file-input"
      >
        <option value="">Select your role</option>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
        <option value="expert">Expert</option>
      </select>
      <button className="button" onClick={handleLogin}>
        Login
      </button>
      <button className="button secondary" onClick={() => navigate('/register')}>
        Go to Register
      </button>
      <button
        className="button secondary"
        onClick={() => navigate('/')}
        style={{ marginTop: '20px' }}
      >
        Go To Home Page
      </button>
    </div>
  );
}

export default Login;
