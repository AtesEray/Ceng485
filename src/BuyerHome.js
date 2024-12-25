import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import ownerABI from './contracts/Owner.json'; // Doğru klasörden ABI'yi import edin

// Kontrat adresinizi buraya ekleyin
const ownerContractAddress = "0xYourContractAddress"; // Owner kontratının gerçek adresi

const BuyerHome = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [ownerContract, setOwnerContract] = useState(null);
  const [vin, setVin] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState(null);
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
  
          // Owner kontrat nesnesini başlatma
          const owner = new web3Instance.eth.Contract(ownerABI.abi, ownerContractAddress); // Eğer ownerABI içinde abi varsa
          // Eğer ownerABI doğrudan ABI'yi içeriyorsa şu şekilde kullanın:
          // const owner = new web3Instance.eth.Contract(ownerABI, ownerContractAddress);
  
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

  // Araç bilgilerini getirme
  const handleGetVehicle = async () => {
    try {
      if (!vin || !ownerContract) {
        return alert('Please enter a valid VIN.');
      }

      const vehicleData = await ownerContract.methods.vehicles(vin).call({
        from: account, // İşlemi gönderen hesap
        gas: 3000000,  // Gas limit
      });
      setVehicleInfo({
        plateNumber: vehicleData[0], // Araç plakası
        vin: vehicleData[1],         // Araç VIN (Vehicle Identification Number)
        owner: vehicleData[2],       // Araç sahibi
      });
      setVehicleInfo({
        plateNumber: vehicleData[0],
        vin: vehicleData[1],
        owner: vehicleData[2],
      });
      setError(null); // Hata mesajını temizle
    } catch (err) {
      console.error('Error fetching vehicle info:', err);
      setError('Failed to fetch vehicle information. Please check the VIN or the contract.');
    }
  };

  return (
    <div>
      <h1>Buyer Home</h1>
      <p>Connected Account: {account}</p>
      <div>
        <input
          type="text"
          placeholder="Enter VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
        />
        <button onClick={handleGetVehicle}>Get Vehicle Info</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {vehicleInfo && (
        <div>
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
