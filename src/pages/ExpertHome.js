import React, { useState } from "react";
import { create } from "ipfs-http-client";
import Web3 from "web3";
import DocumentStoreABI from '../contracts/DocumentStore.json';

const ExpertHome = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [hash, setHash] = useState('');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  // IPFS Client
  const ipfs = create({ url: 'http://127.0.0.1:6001/api/v0' });

  // Web3 ve kontrat bağlantısı
  const connectBlockchain = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
  
      const contractInstance = new web3.eth.Contract(
        DocumentStoreABI.abi,
        "0xe48b724Dde59ef2751B189B8C54e574BcC2F3c0b" // Kontrat adresi
      );
      setContract(contractInstance);
  
      // Bağlantı Kontrolleri
      console.log("Connected account:", accounts[0]); // Bağlı hesap
      console.log("Contract instance:", contractInstance); // Kontrat nesnesi
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Dosya seçimi
  const onFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  // IPFS'ye dosya yükleme
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
    if (!contract || !account) {
      alert("Connect to blockchain first.");
      return;
    }
  
    try {
      // IPFS Bağlantısını Test Etme
      console.log("Testing IPFS connection...");
      const id = await ipfs.id(); // IPFS bağlantısını doğrular
      console.log("Connected to IPFS node:", id);
  
      // IPFS'e dosya yükleme
      console.log("Uploading file to IPFS...");
      const added = await ipfs.add(selectedFile);
      console.log("Uploaded to IPFS. CID:", added.path);
      setHash(added.path);
  
      // Blockchain'e hash kaydetme
      console.log("Storing hash on blockchain...");
      await contract.methods.addDocument(added.path, "Expertise Report").send({ from: account });
      console.log("Document added to blockchain with CID:", added.path);
      alert("IPFS hash stored on blockchain!");
    } catch (error) {
      console.error("Error during IPFS upload or blockchain store:", error);
      alert("Failed to upload file or store hash on blockchain.");
    }
  };
  
  

  return (
    <div>
      <h1>Expert Dashboard</h1>
      <button onClick={connectBlockchain}>Connect to Blockchain</button>
      <p>Connected Account: {account}</p>
      <input type="file" onChange={onFileChange} />
      <button onClick={handleUpload}>Upload to IPFS</button>
      {hash && (
        <p>
          File Hash:{" "}
          <a
            href={`https://ipfs.io/ipfs/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hash}
          </a>
        </p>
      )}
    </div>
  );
};

export default ExpertHome;
