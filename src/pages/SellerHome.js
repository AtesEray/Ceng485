import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import sellerABI from '../contracts/Seller.json'; // Correct ABI import for Seller contract
import './css/SellerDashboard.css';  // Styling for the Seller Dashboard page

const sellerContractAddress = "0x17d86102230B5944D9c5F34ed4D88DB64207c86E"; // Replace with the actual seller contract address



const SellerDashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [sellerContract, setSellerContract] = useState(null);
  const [vin, setVin] = useState('');
  const [vehicleListing, setVehicleListing] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // For navigation to Vehicle Details page


  
  // Predefined VINs to display buttons
  const predefinedVins = ['VIN123456789', 'VIN987654321', 'VIN567890123'];

  // Initialize Web3 and Seller contract
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });  // Request account access

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

  // Fetch vehicle listing based on VIN
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
        vin,
        price: listingData.price,
        isActive: listingData.isActive,
      });

      setError(null); // Clear any previous error messages
    } catch (err) {
      console.error('Error fetching listing data:', err);
      setError('Failed to fetch listing. Please check the VIN or the contract.');
    }
  };

  // Navigate to Vehicle Details page
  const handleNavigateToVehicleDetails = (vin) => {
    navigate(`/vehicle/${vin}`); // Navigate to the vehicle details page
  };

  return (
    <div className="seller-dashboard-container">
      <h1 className="seller-dashboard-title">Seller Dashboard</h1>
      <p className="account-info">Connected Account: {account}</p>

      <div className="vin-selection">
        <h3>Select a Vehicle VIN:</h3>
        <div className="vin-buttons">
          {predefinedVins.map((vin, index) => (
            <button
              key={index}
              className="vin-button"
              onClick={() => handleNavigateToVehicleDetails(vin)}
            >
              {vin}
            </button>
          ))}
        </div>
      </div>

      <div className="vin-input-section">
        <input
          type="text"
          placeholder="Enter VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
        />
        <button className="get-listing-btn" onClick={handleGetListing}>
          Get Vehicle Listing
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {vehicleListing && (
        <div className="vehicle-listing-info">
          <h3>Vehicle Listing</h3>
          <p>VIN: {vehicleListing.vin}</p>
          <p>Price: {web3.utils.fromWei(vehicleListing.price.toString(), 'ether')} ETH</p>
          <p>Status: {vehicleListing.isActive ? 'Active' : 'Inactive'}</p>
          <button className="view-vehicle-details-btn" onClick={() => handleNavigateToVehicleDetails(vin)}>
            View Vehicle Details
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
