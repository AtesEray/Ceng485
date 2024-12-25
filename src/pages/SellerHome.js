import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import sellerABI from '../contracts/Seller.json'; // Import the correct ABI for Seller contract

const sellerContractAddress = "0x17d86102230B5944D9c5F34ed4D88DB64207c86E"; // Replace with actual seller contract address

const SellerDashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [sellerContract, setSellerContract] = useState(null);
  const [vin, setVin] = useState('');
  const [vehicleListing, setVehicleListing] = useState(null);
  const [error, setError] = useState(null);

  console.log(vin);

  // Web3 and contract initialization
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });  // Request accounts access

          const accounts = await web3Instance.eth.getAccounts();
          setWeb3(web3Instance);
          setAccount(accounts[0]);

          const seller = new web3Instance.eth.Contract(sellerABI.abi, sellerContractAddress);
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

  const handleGetListing = async () => {
    try {
      if (!vin || !sellerContract) {
        return alert('Please enter a valid VIN.');
      }

      const listingData = await sellerContract.methods.listings(vin).call({
        from: account, // Sender account
        gas: 3000000,  // Gas limit
      });

      if (!listingData.isActive) {
        setError('This vehicle is not listed for sale.');
        return;
      }

      setVehicleListing({
        vin ,
        price: listingData.price,
        isActive: listingData.isActive,
      });

      setError(null); // Clear any error message
    } catch (err) {
      console.error('Error fetching listing data:', err);
      setError('Failed to fetch listing. Please check the VIN or the contract.');
    }
  };

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <p>Connected Account: {account}</p>
      <div>
        <input
          type="text"
          placeholder="Enter VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
        />
        <button onClick={handleGetListing}>Get Vehicle Listing</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {vehicleListing && (
        <div>
          <h3>Vehicle Listing</h3>
          <p>VIN: {vehicleListing.vin}</p>
          <p>Price: {web3.utils.fromWei(vehicleListing.price.toString(), 'ether')} ETH</p>
          <p>Status: {vehicleListing.isActive ? 'Active' : 'Inactive'}</p>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
