import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import DocumentStoreABI from '../contracts/DocumentStore.json'; // Kontrat ABI
const contractAddress = "0x113f4a490fc664db77F6427B701c85f712a9FF69"; // DocumentStore kontrat adresi

const BuyerHome = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  // Blockchain'e bağlanma
  const connectBlockchain = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.requestAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(
          DocumentStoreABI.abi,
          contractAddress
        );
        setContract(contractInstance);

        console.log("Connected to Blockchain with account:", accounts[0]);
        alert(`Connected to Blockchain with account: ${accounts[0]}`);
      } else {
        alert('MetaMask is required!');
      }
    } catch (err) {
      console.error('Error connecting to Blockchain:', err);
      setError('Failed to connect to Blockchain. Please check MetaMask.');
    }
  };

  // MetaMask hesap değişikliklerini dinle
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          console.log("MetaMask account changed:", accounts[0]);
          alert(`Account switched to: ${accounts[0]}`);
        } else {
          setAccount(null);
          console.log("No MetaMask account connected.");
        }
      });
    }
  }, []);

  // Hesap adresini manuel olarak güncelleme
  const updateAccount = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        alert(`Account updated to: ${accounts[0]}`);
      } else {
        alert('No accounts found.');
      }
    }
  };

  // Blockchain'den dosyaları çekme
  const fetchDocuments = async () => {
    if (!contract) {
      setError('Contract is not connected.');
      return;
    }
    try {
      const totalDocuments = await contract.methods.documents().call();
      const docs = [];
      for (let i = 0; i < totalDocuments.length; i++) {
        const doc = await contract.methods.getDocument(i).call();
        docs.push({
          ipfsHash: doc[0],
          description: doc[1],
          uploader: doc[2],
        });
      }
      setDocuments(docs);
      console.log("Fetched documents:", docs);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to fetch documents from blockchain.');
    }
  };

  // Dosyaları sayfa yüklendiğinde çek
  useEffect(() => {
    if (contract) fetchDocuments();
  }, [contract]);

  return (
    <div>
      <h1>Buyer Home</h1>
      <button onClick={connectBlockchain}>Connect to Blockchain</button>
      <button onClick={updateAccount}>Update Account</button>
      <p>Connected Account: {account}</p>
      <button onClick={fetchDocuments}>Refresh Files</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Uploaded Files</h2>
      {documents.length > 0 ? (
        <ul>
          {documents.map((doc, index) => (
            <li key={index}>
              <p>Description: {doc.description}</p>
              <p>Uploader: {doc.uploader}</p>
              <p>
                <a
                  href={`https://ipfs.io/ipfs/${doc.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
};

export default BuyerHome;
