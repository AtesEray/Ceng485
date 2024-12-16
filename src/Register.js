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
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  const handleRegister = () => {
    const { name, surname, phone, email, password, birthDate } = formData;

    // Boş alan kontrolü
    if (!name || !surname || !phone || !email || !password || !birthDate) {
      setError('Please fill all blank spaces');
      return;
    }
    

    // Yaş kontrolü
    const age = calculateAge(birthDate);
    if (age < 18) {
      setError('You must be at least 18 years old to register.');
      return;
    }

    // Tüm doğrulamalardan geçtiğinde
    setError('');
    alert('Registration Successful!');
    console.log('Registered User:', formData);
    navigate('/login');
  };

  return (
    <div className="container">
      <h2 className="title">Register</h2>

      {/* Hata Mesajı */}
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

      {/* Form Alanları */}
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

      {/* Butonlar */}
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