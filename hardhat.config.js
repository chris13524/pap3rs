require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  console.log('Outputting signer/accounts info')
  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      chainId: 1337
    },
    "ethereum": {
      url: "https://mainnet.infura.io/v3/984680a7a05649beaf37b23462025764",
      chainId: 1,
      accounts: ["b34d5d8a1d64c7fb66bf26b747bf9edaf0106cbd69d72b74ab8e8b8ba1e0eb39"]
    },
    "polygon": {
      url: "https://polygon-rpc.com/",
      chainId: 137,
      accounts: ["b34d5d8a1d64c7fb66bf26b747bf9edaf0106cbd69d72b74ab8e8b8ba1e0eb39"]
    },
    "polygon-mumbai": {
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      accounts: process.env.POLYGON_MUMBAI_PRIVATE_KEY !== undefined? [process.env.POLYGON_MUMBAI_PRIVATE_KEY]: [],
    },
  },
  etherscan: {
    apiKey: {
      "polygon": process.env.POLYGON_MAINNET_API_KEY !== undefined ? process.env.POLYGON_MAINNET_API_KEY : '',
      "polygon-mumbai": process.env.POLYGON_MUMBAI_API_KEY !== undefined ? process.env.POLYGON_MUMBAI_API_KEY : ''
    }
  }
};
