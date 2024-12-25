import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import Login from './Login';
import Register from './Register';
import BuyerHome from './BuyerHome';
import SellerHome from './SellerHome';
import ExpertHome from './ExpertHome';



function Home({ connectWallet, account }) {
  const navigate = useNavigate();
  return (
    <div className='container'>
      <h2 className="title"> Welcome!</h2>
      {account ? (
        <p className="connected"> Connected Account: {account}</p>
      ) : (
        <button 
          className="button" 
          onClick={connectWallet}> 
          
          Connect Wallet 
          </button>
      )}
      <br />
      
      <button
        className="button secondary"
        onClick={() => navigate('/login')}
        style={{ marginTop: '1px' }}
      >
        Login Page
      </button>
      <br />
      <button
        className="button secondary"
        onClick={() => navigate('/register')}
        style={{ marginTop: '1px' }}
      >
        Register Page
      </button>
    </div>
  );
}

function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log('Connected account:', accounts[0]);
        return accounts[0];
      } catch (error) {
        if (error.code === -32002) {
          alert('MetaMask is already processing a connection request. Please check your MetaMask extension.');
        } else {
          console.error('Connection error:', error);
        }
      }
    } else {
      alert('MetaMask is not installed. Please install it to continue.');
    }
  };
  return (
    <Router>
      <div>
        <h1 className="header"> Blockchain Auto Expert System</h1>
        <Routes>
          <Route
            path="/"
            element={<Home connectWallet={connectWallet} account={account} />}
          />
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/buyer-home" element={<BuyerHome />} />
          <Route path="/seller-home" element={<SellerHome />} />
          <Route path="/expert-home" element={<ExpertHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
