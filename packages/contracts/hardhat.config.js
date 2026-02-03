require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    tempo: {
      url: "https://rpc.testnet.tempo.xyz",
      chainId: 42429,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
};