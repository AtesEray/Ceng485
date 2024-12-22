import React, { useState, useEffect } from 'react';
import { initWeb3, initContract } from './utils/web3Utils';
import OwnerABI from './contracts/Owner.json';

const BuyerDashboard = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [vehicleData, setVehicleData] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const web3Instance = await initWeb3();
                setWeb3(web3Instance);

                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);

                const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
                const contractInstance = initContract(OwnerABI.abi, contractAddress);
                setContract(contractInstance);

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
