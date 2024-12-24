import Web3 from 'web3';

// Initialize Web3
export const initWeb3 = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        return web3;
    } else if (window.web3) {
        return new Web3(window.web3.currentProvider);
    } else {
        throw new Error('No Ethereum browser extension detected. Install MetaMask!');
    }
};

// Initialize Contract
export const initContract = (abi, address) => {
    const web3 = new Web3(window.ethereum || window.web3.currentProvider);
    return new web3.eth.Contract(abi, address);
};

export default initWeb3;
