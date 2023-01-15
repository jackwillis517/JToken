const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Jtoken", function () {
  let supply = 100;
  let token;
  let owner;
  let addr1;
  let addr2;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("JToken");
    token = await Token.deploy(supply);
  });

  describe("Deployment", () => {
    it("Should deploy the token with an initial reserve of 100", async () => {
        expect(await token.totalSupply()).to.equal(supply);
    });
  });

  describe("Transaction", () => {
    it("Should transfer 10 tokens between accounts", async () => {
        await token.transfer(addr1.address, 10);
        const addr1Balance = await token.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(10);
    });

    it("Should fail to transfer 100 tokens to another account", async () => {
        await expect(token.connect(addr1).transfer(addr2.address, 100)).to.be.reverted;
    });

    it("Shoud transfer 10 tokens to another account", async () => {
        await token.connect(addr1).transfer(addr2.address, 10);
        const addr2Balance = await token.balanceOf(addr2.address);
        expect(addr2Balance).to.equal(10);
    });
  });
});
