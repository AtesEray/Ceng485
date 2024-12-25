require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://localhost:8545", // Replace with the correct URL if using another local network
      accounts: ["06a5fa833f26eb951aaee0d7b691b07c77cfc20ae8ad1d49a916c04ad39e63ae"] // Add the private key of the account to deploy the contract
    },
    // Configure other networks like Rinkeby, Mainnet, etc. if needed
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
      accounts: [`06a5fa833f26eb951aaee0d7b691b07c77cfc20ae8ad1d49a916c04ad39e63ae`]
    }
  }
};
