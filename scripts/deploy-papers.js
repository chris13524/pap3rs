// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
      "gets automatically created and destroyed every time. Use the Hardhat" +
      " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log(`Account balance: for deployer wallet:${deployer.address} = ${(await deployer.getBalance()).toString()}`,);

  const Pap3rs = await ethers.getContractFactory("Pap3rs");
  const contract = await Pap3rs.deploy("0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68"); // mumbai registry
  await contract.deployed();
  console.log("Pap3rs contract address:", contract.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(contract, mockToken);
}

function saveFrontendFiles(contract, mockToken) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../public/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Pap3rs: contract.address, MockToken: mockToken.address }, undefined, 2),
  );

  const Pap3rsArtifact = artifacts.readArtifactSync("Pap3rs");
  fs.writeFileSync(
    contractsDir + "/Pap3rs.json",
    JSON.stringify(Pap3rsArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
