const { expect } = require("chai");

describe("Pap3rs contract", function () {
  let Token;
  let contract;
  let mockToken;
  let deployer;
  let author;
  let donor;
  let addrs;

  let cid = "2l3k5j23lk54j23lk4j23lk4";
  let donationAmt = ethers.utils.parseUnits("100", 18);

  beforeEach(async function () {
    Pap3rs = await ethers.getContractFactory("Pap3rs");
    MockToken = await ethers.getContractFactory("MockToken");
    [deployer, author, donor, ...addrs] = await ethers.getSigners();
    contract = await Pap3rs.deploy();
    mockToken = await MockToken.deploy("USDC","USDC",1000000);
    await contract.deployed();
    await mockToken.deployed();
  });

  describe("Transactions", function () {

      it("Name as expected", async function () {
        expect(await contract.name()).to.equal("Pap3rs");
      });

      it("Claim works as expected", async function () {
        await contract.connect(author).claim(cid);
        let ownerAddress = await contract.getOwner(cid);
        expect(ownerAddress).to.equal(author.address);
        let cids = await contract.listCids();
        expect(cids.length).to.equal(1);
      });

      it("approveDonationToken sets proper allowance on donation token", async function () {
        await mockToken.connect(donor).approve(contract.address, donationAmt);
        let allowance = await mockToken.allowance(donor.address,contract.address);
        await expect(allowance).to.equal(donationAmt);
      });

      it("Donation to cid not submitted should be rejected", async function () {
        await expect(contract.connect(donor).donate(cid,mockToken.address,donationAmt)).to.be.revertedWith("CID must have been contributed to donate to");
      });

      it("Donation to cid submitted should work", async function () {
        await mockToken.connect(deployer).transfer(donor.address,donationAmt);
        await contract.connect(author).claim(cid);
        await mockToken.connect(donor).approve(contract.address, donationAmt);
        await contract.connect(donor).donate(cid, mockToken.address, donationAmt);
        let donationTokenBalance = await contract.getDonationBalance(cid, mockToken.address);
        await expect(donationTokenBalance).to.equal(donationAmt);
      });

  });
});
