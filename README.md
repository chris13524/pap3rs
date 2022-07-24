# Pap3rs

Academic papers published on IPFS.  Those wanting to submit an academic paper
can do so via a dapp hosted on IPFS (deployed via VAList?).   The dapp will allow
writer to connect to their wallet, access a paper upload screen.  On this page,
in addition to uploading the doc via browse button or drag and drop, they can fill
out details on themselves, which will be metadata associated with the paper.  This
metadata can be stored via Ceramic.  
Submitting the form will initialize an upload a PDF to IPFS, get back the CID for that PDF, and it will call
a smart contract to register the current wallet/DID as the owner of that document
as defined by the CID.   Additionally the paper and its definition in the
contract could allow supporters/donors to fund the research project associated
with the paper.   The owner of the content would have the rights to access this funding
based on factors TBD.  (Could be voting from the funders to approve release of the funds etc)
Also the owner of the paper would have the rights to revise the paper.  (which could affect
    how the CID/owner association is defined)

## Development

```bash
npm run dev
```
npx hardhat node

#open new terminal window

#deploy contract
npx hardhat run --network localhost scripts/deploy.js

#console debugging
npx hardhat console --network localhost
[owner, addr1, addr2, ...addrs] = await ethers.getSigners();
Pap3rs = await ethers.getContractFactory("Pap3rs");
c = await ethers.getContractAt("Pap3rs","0x5FC8d32690cc91D4c39d9d3abcBD16989F875707");

## Deploy to Mumbai

```bash
POLYGON_MUMBAI_PRIVATE_KEY=$(cat private.key) npx hardhat run --network polygon-mumbai scripts/deploy.js
```

## Subgraph Setup

Setup repo boilerplate:

```bash
graph init --product hosted-service --from-contract 0x8598a95186dd548E942fD74fAB8bCFbfac57903D --network mumbai --abi artifacts/contracts/Pap3rs.sol/Pap3rs.json chris13524/pap3rs subgraph
```

Login to hosted service:

```bash
graph auth --product hosted-service
```

```bash
npm run build
```

```bash
npm run deploy
```
