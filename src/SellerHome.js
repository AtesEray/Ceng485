import React, { useState, useEffect } from 'react';
import { initWeb3, initContract } from './utils/web3Utils'; // Use both initWeb3 and initContract
import BuyerABI from './contracts/Buyer.json'; // Import Buyer contract ABI
import OwnerABI from './contracts/Owner.json'; // Import Owner contract ABI (if you are fetching vehicle data from the Owner contract)

const BuyerDashboard = () => {
    const [account, setAccount] = useState(null);
    const [vehicleData, setVehicleData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Initialize Web3, contracts, and vehicle data
    useEffect(() => {
        const initialize = async () => {
            try {
                // Initialize web3
                const web3 = await initWeb3();

                // Fetch connected accounts
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);

                // Initialize Buyer contract
                const buyerContractAddress = '0xYourBuyerContractAddress'; // Replace with the deployed Buyer contract address
                const buyerContract = initContract(BuyerABI.abi, buyerContractAddress);

                // Example: Fetch purchase details for a specific VIN (VIN123 in this case)
                const purchase = await buyerContract.methods.purchases('VIN123').call();
                setVehicleData({
                    vin: purchase.vin,
                    price: web3.utils.fromWei(purchase.price, 'ether'),
                    buyer: purchase.buyer,
                });
            } catch (error) {
                setErrorMessage(error.message);
                console.error('Error initializing:', error);
            }
        };

        initialize();
    }, []);

    // Function to handle buying a vehicle
    const buyVehicle = async () => {
        try {
            const web3 = await initWeb3();
            const buyerContractAddress = '0xYourBuyerContractAddress'; // Replace with the deployed address
            const buyerContract = initContract(BuyerABI.abi, buyerContractAddress);

            const vin = 'VIN123'; // Replace with dynamic VIN if needed
            const priceInWei = web3.utils.toWei('1', 'ether'); // Replace with actual price (ETH)

            // Call buyVehicle function from the contract
            await buyerContract.methods.buyVehicle(vin).send({
                from: account,
                value: priceInWei,
            });

            alert('Vehicle purchased successfully!');
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error purchasing vehicle:', error);
        }
    };

    return (
        <div>
            <h1>Buyer Dashboard</h1>
            {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}
            <p>Account: {account}</p>

            {vehicleData ? (
                <div>
                    <h2>Vehicle Information</h2>
                    <p>VIN: {vehicleData.vin}</p>
                    <p>Price: {vehicleData.price} ETH</p>
                    <p>Buyer: {vehicleData.buyer}</p>
                    <button onClick={buyVehicle}>Buy Vehicle</button>
                </div>
            ) : (
                <p>Loading vehicle information...</p>
            )}
        </div>
    );
};

export default BuyerDashboard;
