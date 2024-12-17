import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    password: '',
    birthDate: '',
    role: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong.');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Register</h2>
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={formData.name}
        onChange={handleInputChange}
        className="file-input"
      />
      <input
        type="text"
        name="surname"
        placeholder="Enter your surname"
        value={formData.surname}
        onChange={handleInputChange}
        className="file-input"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={handleInputChange}
        className="file-input"
      />
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        className="file-input"
      />
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleInputChange}
        className="file-input"
      />
      <input
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={handleInputChange}
        className="file-input"
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleInputChange}
        className="file-input"
      >
        <option value="">Select your role</option>
        <option value="buyer">Buyer Person (Buyer)</option>
        <option value="seller">Seller Person (Seller)</option>
        <option value="expert">Auto Exper Firm (Expert)</option>
      </select>
      <button className="button" onClick={handleRegister}>
        Register
      </button>
      <button className="button secondary" onClick={() => navigate('/login')}>
        Back to Login
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

export default Register;
