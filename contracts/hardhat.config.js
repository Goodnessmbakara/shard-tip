require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    shardeum: {
      url: "https://api-unstable.shardeum.org",
      chainId: 8080,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      shardeum: "abc", // Placeholder - Shardeum explorer may not support verification yet
    },
    customChains: [
      {
        network: "shardeum",
        chainId: 8080,
        urls: {
          apiURL: "https://explorer-unstable.shardeum.org/api",
          browserURL: "https://explorer-unstable.shardeum.org",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}
