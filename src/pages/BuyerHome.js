import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useParams } from 'react-router-dom'; // Access VIN from URL parameters
import ownerABI from '../contracts/Owner.json';
import './css/VehicleDetails.css';

const ownerContractAddress = "0x39b7b68e3e89d1dbbd8001a0806c411abbab7f13";

const VehicleDetails = () => {
  const { vin } = useParams(); // Extract VIN from the URL parameter
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState(null);

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

          // Fetch vehicle info based on VIN
          const vehicleData = await owner.methods.vehicles(vin).call();
          if (vehicleData) {
            const { 0: plateNumber, 1: vehicleVIN, 2: ownerAddress } = vehicleData;

            // Set vehicle info state
            setVehicleInfo({ plateNumber, vin: vehicleVIN, owner: ownerAddress });

            // Check if the connected account is the vehicle's owner
            setIsOwner(accounts[0].toLowerCase() === ownerAddress.toLowerCase());
          } else {
            setError('Vehicle not found!');
          }
        } else {
          alert('MetaMask is required!');
        }
      } catch (err) {
        console.error('Error fetching vehicle info:', err);
        setError('Failed to fetch vehicle information.');
      }
    };

    initWeb3();
  }, [vin]);

  return (
    <div className="vehicle-details-container">
      <h1>Vehicle Details</h1>
      {error && <p className="error-message">{error}</p>}

      {vehicleInfo ? (
        <div className="vehicle-info">
          <p>Plate Number: {vehicleInfo.plateNumber}</p>
          <p>VIN: {vehicleInfo.vin}</p>
          <p>Owner Address: {vehicleInfo.owner}</p>
          <p>
            Is Owner: <strong>{isOwner ? 'Yes (You are the owner)' : 'No'}</strong>
          </p>
        </div>
      ) : (
        <p>Loading vehicle details...</p>
      )}
    </div>
  );
};

export default VehicleDetails;
