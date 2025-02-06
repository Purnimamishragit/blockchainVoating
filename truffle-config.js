const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = "proof pull mention lava history bachelor approve grass quarter begin thing lucky";  // Replace with your mnemonic

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // Ganache local network address
      port: 8546,         // Ganache default port
      network_id: "*", // Ganache network ID (default)
      from: "0xB1329afe9f4001708B6D39FF8FbD72fD9b34F533", // Replace with your Ganache account address
      gas: 6721975,       // Set gas limit (you can adjust if needed)
      gasPrice: 20000000, // Set gas price (you can adjust if needed)
    },
  },
  
  compilers: {
    solc: {
      version: "0.8.19",  // Match the Solidity version your contract is using
    },
  },
};
