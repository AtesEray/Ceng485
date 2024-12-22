import Web3 from 'web3';

let web3;

export const initWeb3 = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request access to accounts
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        console.error('No Ethereum browser extension detected');
    }
    return web3;
};

export const initContract = (abi, address) => {
    if (!web3) {
        console.error('Web3 not initialized');
        return null;
    }
    return new web3.eth.Contract(abi, address);
};
