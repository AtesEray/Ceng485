import React, {useState} from 'react';
import { BrowserRouter as Router,Routes,Route, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import Login from './Login';
import Register from './Register';


function Home({ connectWallet, account}) {
  const navigate = useNavigate();
  return (
  <div className='container'>
    <h2 className="title"> Welcome!</h2>
    {account ? (
      <p className="connected"> Coonected Account: {account}</p>
    ) : (
      <button className= "button" onClick= {connectWallet} > ConnectWallet </button>
      
    )}
    <br />
    <button
    className="button third"
    onClick={() => navigate('upload')}
    style={{marginTop:'20px'}}
    >
      Go To Upload Report Page
    </button>
    <br />
    <button
      className="button secondary"
      onClick={() => navigate ('/login')}
      style={{marginTop : '10px'}}
      > 
        Login Page
      </button>
      <br/>
      <button
      className="button secondary"
      onClick={() => navigate ('/register')}
      style={{marginTop : '10px'}}
      >
        Register Page
      </button>
  </div>
  );
  
}
function UploadReport() {
  const navigate = useNavigate();
  return (
  <div className="container">
    <h2 className="title" >Upload Report Page</h2>
    <p className="description"> Here you can upload auto ekspert report </p>
    <div className="Upload-section">
      <input type="file" className="file-input" />
      <button className="button"> Upload </button>
      </div>
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
function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try{
        await window.ethereum.request({method: 'eth_requestAccounts'});
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Connect wallet is unsuccessfull",error);
      }
      } else {
        alert ("Please download MetaMask");
      }
    };
  
  return (
    <Router>

    <div>
      <h1 className="header"> Blockchain Auto Expert System</h1>
      <Routes>
        <Route path ="/"
        element = {<Home connectWallet={connectWallet} account={account} />}
        />
        <Route path ="/upload" element={<UploadReport />} />

        <Route path ="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;


