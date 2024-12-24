import React, { useState, useEffect } from 'react';
import { initWeb3, initContract } from './utils/web3Utils'; // Web3 ve kontrat fonksiyonları
import SellerABI from './contracts/Owner.json'; // Satıcıya özel akıllı kontrat ABI'si

const SellerDashboard = () => {
    const [account, setAccount] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const initialize = async () => {
            try {
                // Web3 bağlantısını başlat
                const web3 = await initWeb3();
    
                // Kullanıcının hesap bilgilerini al
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
    
                // Akıllı kontrata bağlan
                const contractAddress = '0x39b7B68e3e89d1dbBd8001a0806c411abBab7f13';
                const contract = initContract(SellerABI.abi, contractAddress);
    
                // Tüm araçların VIN'lerini al
                const allVehicleVins = await contract.methods.getVehicles().call();
    
                // VIN'lere göre araç detaylarını al ve filtrele
                const sellerVehicles = [];
                for (const vin of allVehicleVins) {
                    const vehicleDetails = await contract.methods.getVehicle(vin).call();
                    const [vehicleVin, plateNumber, owner] = vehicleDetails;
    
                    if (owner.toLowerCase() === accounts[0].toLowerCase()) {
                        sellerVehicles.push({ vin: vehicleVin, plateNumber });
                    }
                }
    
                setVehicles(sellerVehicles);
            } catch (error) {
                setErrorMessage(error.message);
                console.error('Error initializing:', error);
            }
        };
    
        initialize();
    }, []);
    

    return (
        <div>
            <h1>Seller Dashboard</h1>
            {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}
            <p>Account: {account}</p>
            <h2>Your Vehicles</h2>
            {vehicles.length > 0 ? (
                <ul>
                    {vehicles.map((vehicle, index) => (
                        <li key={index}>
                            <p>VIN: {vehicle.vin}</p>
                            <p>Plate Number: {vehicle.plateNumber}</p>
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
