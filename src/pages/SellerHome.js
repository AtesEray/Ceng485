import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import SellerABI from '../contracts/Seller.json'; // Correct path to the Seller ABI

// Kontrat adresinizi buraya ekleyin
const sellerContractAddress = "0x17d86102230B5944D9c5F34ed4D88DB64207c86E"; // Replace with your actual contract address

const SellerDashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [sellerContract, setSellerContract] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  // Web3 ve kontrat bağlantısını başlatma
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          const accounts = await web3Instance.eth.requestAccounts();
          setWeb3(web3Instance);
          setAccount(accounts[0]);

          // Seller kontrat nesnesini başlatma
          const seller = new web3Instance.eth.Contract(SellerABI.abi, sellerContractAddress);
          setSellerContract(seller);
        } else {
          alert('MetaMask is required!');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
        setError('Failed to initialize Web3. Make sure MetaMask is installed and connected.');
      }
    };
    initWeb3();
  }, []);

  // Satıcıya ait araçları getirme (getSellerVehicles is replaced with listings fetching logic)
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        if (!sellerContract || !account) return;
  
        const sellerVehicles = await sellerContract.methods.getSellerListings(account).call({ from: account });
  
        const formattedVehicles = sellerVehicles.map(vehicle => ({
          vin: vehicle.vin,
          plateNumber: vehicle.plateNumber,
          price: vehicle.price,  // Example field
        }));
  
        setVehicles(formattedVehicles);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to fetch vehicles for this seller.');
      }
    };
  
    fetchVehicles();
  }, [sellerContract, account]);
  

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <p>Connected Account: {account}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Your Vehicles</h2>
      {vehicles.length > 0 ? (
        <ul>
          {vehicles.map((vehicle, index) => (
            <li key={index}>
              <p>VIN: {vehicle.vin}</p>
              <p>Price: {web3 ? web3.utils.fromWei(vehicle.price, 'ether') : 0} ETH</p> {/* Convert price from Wei to ETH */}
              <p>Status: {vehicle.isActive ? 'Active' : 'Inactive'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No vehicles found for this seller.</p>
      )}
    </div>
  );
};

export default SellerDashboard;
