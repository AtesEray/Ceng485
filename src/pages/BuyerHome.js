import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import ownerABI from '../contracts/Owner.json'; // Correct ABI import
import './css/BuyerHome.css';


// Contract address
const ownerContractAddress = "0x39b7b68e3e89d1dbbd8001a0806c411abbab7f13"; // Owner contract address

const BuyerHome = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [ownerContract, setOwnerContract] = useState(null);
  const [vin, setVin] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // For navigation to the Seller Vehicle Info page

  // Sample VINs for demonstration
  const predefinedVins = ['VIN123456789', 'VIN987654321', 'VIN567890123'];

  // Initialize Web3 and contract
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          const accounts = await web3Instance.eth.requestAccounts();
          setWeb3(web3Instance);
          setAccount(accounts[0]);

          // Initialize contract
          const owner = new web3Instance.eth.Contract(ownerABI.abi, ownerContractAddress);
          setOwnerContract(owner);
        } else {
          alert('MetaMask is required!');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    };
    initWeb3();
  }, []);

  // Fetch vehicle info
  const handleGetVehicle = async () => {
    try {
      if (!vin || !ownerContract) {
        return alert('Please enter a valid VIN.');
      }

      const vehicleData = await ownerContract.methods.vehicles(vin).call({
        from: account, // Sender account
        gas: 3000000,  // Gas limit
      });
      setVehicleInfo({
        plateNumber: vehicleData[0],
        vin: vehicleData[1],
        owner: vehicleData[2],
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicle info:', err);
      setError('Failed to fetch vehicle information. Please check the VIN or the contract.');
    }
  };

  const handleNavigateToSeller = (vin) => {
    navigate(`/vehicle/${vin}`); // Navigate to the Seller Vehicle Info page
  };

  return (
    <div className="buyer-home-container">
      <h1 className="buyer-home-title">Buyer Home</h1>
      <p className="account-info">Connected Account: {account}</p>

      <div className="vin-selection">
        <h3>Select a Vehicle VIN:</h3>
        <div className="vin-buttons">
          {predefinedVins.map((vin, index) => (
            <button
              key={index}
              className="vin-button"
              onClick={() => handleNavigateToSeller(vin)}
            >
              {vin}
            </button>
          ))}
        </div>
      </div>

      <div className="vin-input">
        <input
          type="text"
          placeholder="Enter VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
        />
        <button className="get-vehicle-btn" onClick={handleGetVehicle}>
          Get Vehicle Info
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {vehicleInfo && (
        <div className="vehicle-info">
          <h3>Vehicle Info</h3>
          <p>Plate Number: {vehicleInfo.plateNumber}</p>
          <p>VIN: {vehicleInfo.vin}</p>
          <p>Owner: {vehicleInfo.owner}</p>
        </div>
      )}
    </div>
  );
};

export default BuyerHome;
