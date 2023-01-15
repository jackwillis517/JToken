const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exchange", function () {
  let supply = 100;
  let cost = 1000;
  let token;
  let exchange;
  let owner;
  let addr1;
  let addr2;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("JToken");
    token = await Token.deploy(supply);

    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(token.address, cost);
  });

  describe("Sell", () => {
    it("Should fail if the sender didn't approve their tokens to be taken", async () => {
        await expect(exchange.connect(addr1).sell(1)).to.be.reverted;
    });

    it("Should allow the user to approve the selling of a token on the exchange", async () => {
        await exchange.connect(addr1).buy(1, { value: 1000 });
        await token.connect(addr1).approve(exchange.address, 1);
        const approvedAmount = await exchange.connect(addr1).viewApproved();
        expect(parseInt(approvedAmount)).to.equal(1);
    });
  });
});