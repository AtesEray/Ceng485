import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useParams } from 'react-router-dom';
import ownerABI from '../contracts/Owner.json';

const ownerContractAddress = "0x39b7b68e3e89d1dbbd8001a0806c411abbab7f13";



const VehicleDetails = () => {
  const { vin } = useParams();
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (!window.ethereum) {
          setError('MetaMask is not installed. Please install MetaMask and reload the page.');
          return;
        }
  
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
  
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        console.log('Connected account:', accounts[0]);
  
        if (!vin) {
          setError('VIN is missing or invalid.');
          return;
        }
  
        const owner = new web3Instance.eth.Contract(ownerABI.abi, ownerContractAddress);
        const vehicleData = await owner.methods.vehicles(vin).call();
  
        console.log('Vehicle Data:', vehicleData);
  
        if (vehicleData && vehicleData[0] !== "") {
          const { 0: plateNumber, 1: vehicleVIN, 2: ownerAddress } = vehicleData;
          setVehicleInfo({ plateNumber, vin: vehicleVIN, owner: ownerAddress });
          setIsOwner(accounts[0]?.toLowerCase() === ownerAddress.toLowerCase());
        } else {
          setError('Vehicle with this VIN does not exist.');
        }
      } catch (err) {
        console.error('Error initializing Web3:', err);
        setError('Failed to initialize Web3 or fetch vehicle information.');
      }
    };
  
    initWeb3();
  }, [vin]);
  
  

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="vehicle-details-container">
      <h1>Vehicle Details</h1>
      {vehicleInfo ? (
        <div>
          <p>Plate Number: {vehicleInfo.plateNumber}</p>
          <p>VIN: {vehicleInfo.vin}</p>
          <p>Owner Address: {vehicleInfo.owner}</p>
          <p>{isOwner ? 'You are the owner of this vehicle.' : 'You are not the owner of this vehicle.'}</p>
        </div>
      ) : (
        <p>Loading vehicle details...</p>
      )}
    </div>
  );
};



export default VehicleDetails;
