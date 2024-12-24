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
                const contractAddress = '0xYourSellerContractAddress'; // Kontrat adresinizi girin
                const contract = initContract(SellerABI.abi, contractAddress);

                // Satıcıya ait araç listesini al
                const sellerVehicles = await contract.methods.getSellerVehicles(accounts[0]).call();
                const formattedVehicles = sellerVehicles.map((vehicle) => ({
                    vin: vehicle[0],
                    plateNumber: vehicle[1],
                }));

                setVehicles(formattedVehicles);
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
