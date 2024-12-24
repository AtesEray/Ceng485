import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import Login from './Login';
import Register from './Register';
import BuyerHome from './BuyerHome';
import SellerHome from './SellerHome';
import ExpertHome from './ExpertHome';
import UploadReportPage from './UploadReportPage'; // Import the UploadReportPage component

function Home({ connectWallet, account }) {
  const navigate = useNavigate();
  return (
    <div className='container'>
      <h2 className="title"> Welcome!</h2>
      {account ? (
        <p className="connected"> Connected Account: {account}</p>
      ) : (
        <button className="button" onClick={connectWallet}> Connect Wallet </button>
      )}
      <br />
      <button
        className="button third"
        onClick={() => navigate('/upload')}
        style={{ marginTop: '20px' }}
      >
        Go To Upload Report Page
      </button>
      <br />
      <button
        className="button secondary"
        onClick={() => navigate('/login')}
        style={{ marginTop: '10px' }}
      >
        Login Page
      </button>
      <br />
      <button
        className="button secondary"
        onClick={() => navigate('/register')}
        style={{ marginTop: '10px' }}
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
        const web3 = new Web3(window.ethereum); // Initialize Web3 with MetaMask provider
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Get the list of accounts
            const accounts = await web3.eth.getAccounts();

            // Set the first account as the connected account
            setAccount(accounts[0]);
        } catch (error) {
            if (error.code === 4001) {
                // User rejected the connection request
                console.error("User rejected the wallet connection request.");
                alert("Wallet connection was rejected. Please try again.");
            } else {
                // Other errors
                console.error("Error connecting to wallet:", error);
            }
        }
    } else {
        // MetaMask is not installed
        alert("MetaMask is not installed. Please install MetaMask to connect.");
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
          <Route path="/upload" element={<UploadReportPage />} /> 
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
