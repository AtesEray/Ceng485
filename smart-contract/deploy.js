const Web3 = require('web3');
const contractABI = require('./VehicleInspectionABI.json');
const contractBytecode = 'CONTRACT_BYTECODE';

const deploy = async () => {
    const web3 = new Web3('https://YOUR_BLOCKCHAIN_NODE');
    const account = 'WALLET_ADDRESS';
    const privateKey = 'PRIVATE_KEY';

    const contract = new web3.eth.Contract(contractABI);
    const tx = contract.deploy({ data: contractBytecode });

    const signedTx = await web3.eth.accounts.signTransaction(
        { to: null, data: tx.encodeABI(), gas: 3000000 },
        privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Contract deployed at:', receipt.contractAddress);
};

deploy();
