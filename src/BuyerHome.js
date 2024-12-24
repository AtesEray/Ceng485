import React, { useState, useEffect } from 'react';
import { initWeb3, initContract } from './utils/web3Utils'; // Use both initWeb3 and initContract
import OwnerABI from './contracts/Owner.json';

const BuyerDashboard = () => {
    const [account, setAccount] = useState(null);
    const [vehicleData, setVehicleData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const initialize = async () => {
            try {
                // Initialize web3
                const web3 = await initWeb3();

                // Fetch connected accounts
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);

                // Contract instance
                const contractAddress = '0x39b7B68e3e89d1dbBd8001a0806c411abBab7f13'; // Replace with your deployed contract address
                const contract = initContract(OwnerABI.abi, contractAddress);

                // Fetch vehicle data (example with VIN "VIN123")
                const vehicle = await contract.methods.getVehicle('VIN123').call();
                setVehicleData({
                    vin: 'VIN123',
                    plateNumber: vehicle[0],
                    owner: vehicle[1],
                });
            } catch (error) {
                setErrorMessage(error.message);
                console.error('Error initializing:', error);
            }
        };

        initialize();
    }, []);

    return (
        <div>
            <h1>Buyer Dashboard</h1>
            {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}
            <p>Account: {account}</p>
            {vehicleData ? (
                <div>
                    <h2>Vehicle Information</h2>
                    <p>VIN: {vehicleData.vin}</p>
                    <p>Plate Number: {vehicleData.plateNumber}</p>
                    <p>Owner: {vehicleData.owner}</p>
                </div>
            ) : (
                <p>Loading vehicle information...</p>
            )}
        </div>
    );
};

export default BuyerDashboard;
