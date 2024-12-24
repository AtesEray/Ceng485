import React, { useState, useEffect } from 'react';
import { initWeb3 } from './utils/web3Utils'; // Removed initContract
import OwnerABI from './contracts/Owner.json';

const BuyerDashboard = () => {
    const [account, setAccount] = useState(null);
    const [vehicleData, setVehicleData] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const web3Instance = await initWeb3();

                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);

                const contractAddress = '0x39b7B68e3e89d1dbBd8001a0806c411abBab7f13'; // Replace with your deployed contract address
                const contractInstance = new web3Instance.eth.Contract(OwnerABI.abi, contractAddress);

                // Fetch vehicle data as an example
                const vehicle = await contractInstance.methods.getVehicle('VIN123').call();
                setVehicleData(vehicle);
            } catch (error) {
                console.error('Error initializing:', error);
            }
        };

        initialize();
    }, []);

    return (
        <div>
            <h1>Buyer Dashboard</h1>
            <p>Account: {account}</p>
            {vehicleData ? (
                <div>
                    <h2>Vehicle Information</h2>
                    <p>VIN: {vehicleData.vin || 'N/A'}</p>
                    <p>Plate Number: {vehicleData.plateNumber || 'N/A'}</p>
                    <p>Owner: {vehicleData.owner || 'N/A'}</p>
                </div>
            ) : (
                <p>Loading vehicle information...</p>
            )}
        </div>
    );
};

export default BuyerDashboard;
