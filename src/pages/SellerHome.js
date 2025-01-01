import React, { useEffect, useState } from "react";
import Web3 from "web3";
import DocumentStoreABI from "../contracts/DocumentStore.json"; // Kontrat ABI
const contractAddress = "0xAEb8C2134f21E48E5C90b3a7885A9332DA3d287e"; // DocumentStore kontrat adresi

const SellerHome = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  // MetaMask ve kontrata bağlanma
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
        alert("MetaMask is required!");
      }
    } catch (err) {
      console.error("Error connecting to Blockchain:", err);
      setError("Failed to connect to Blockchain. Please check MetaMask.");
    }
  };

  // MetaMask hesap değişikliklerini dinle
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
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

  // Manuel olarak hesabı güncelleme
  const updateAccount = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        alert(`Account updated to: ${accounts[0]}`);
      } else {
        alert("No accounts found.");
      }
    }
  };

  return (
    <div>
      <h1>Seller Home</h1>
      <button onClick={connectBlockchain}>Connect to Blockchain</button>
      <button onClick={updateAccount}>Update Account</button>
      <p>Connected Account: {account}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SellerHome;
