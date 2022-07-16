require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const fs = require('fs');
// const mnemonic = fs.readFileSync("../../.secret").toString().trim();
// const mnemonicMainnet = fs.readFileSync("../../.secret-mainnet").toString().trim();
// const privateKey = fs.readFileSync("../../.private-key").toString().trim();
// const privateKeyMainnet = fs.readFileSync("../../.private-key-mainnet").toString().trim();

//const mnemonic = "ozone enter stay alcohol sea ride glance wisdom useful famous grief update neither bacon profit pact front account left truth stereo slogan crush struggle";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      chainId: 1337
    },
    ethereum: {
      url: "https://mainnet.infura.io/v3/984680a7a05649beaf37b23462025764",
      chainId: 1,
      accounts: ["b34d5d8a1d64c7fb66bf26b747bf9edaf0106cbd69d72b74ab8e8b8ba1e0eb39"]
    },
    polygon: {
      url: "https://polygon-rpc.com/",
      chainId: 137,
      accounts: ["b34d5d8a1d64c7fb66bf26b747bf9edaf0106cbd69d72b74ab8e8b8ba1e0eb39"]
    },
    // polygonMumbai: {
    //   url: "https://rpc-mumbai.maticvigil.com/",
    //   chainId: 80001,
    //   accounts: {mnemonic: mnemonic}
    // },
    // bscTestnet: {
    //   url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    //   chainId: 97,
    //   accounts: {mnemonic: mnemonic}
    // },
    // bsc: {
    //   url: "https://bsc-dataseed.binance.org/",
    //   chainId: 56,
    //   accounts: [ privateKeyMainnet ],
    //   gas: 2400000,
    //   gasPrice:5000000000
    // },
    // avalanche: {
    //   url: "https://api.avax.network/ext/bc/C/rpc",
    //   chainId: 43114,
    //   accounts: [ fs.readFileSync("../../.private-key-avalanche").toString().trim() ]
    // },
    // avalancheFujiTestnet: {
    //   url: "https://api.avax.network/ext/bc/C/rpc",
    //   chainId: 43114,
    //   accounts: {mnemonic: mnemonic}
    // }
  },
  etherscan: {
    apiKey: {
      bscTestnet: "7N3TD7RSX2GUIKFE471Z9WI22PPWZ59PFC",
      bsc: "7N3TD7RSX2GUIKFE471Z9WI22PPWZ59PFC",
      polygon: "PM7BQKIPHD1D5I8DEMV49V8TEKD2XAJAWZ",
      polygonMumbai: "PM7BQKIPHD1D5I8DEMV49V8TEKD2XAJAWZ"
    }
  }
};
