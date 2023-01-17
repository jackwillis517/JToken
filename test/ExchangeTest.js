const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exchange", function () {
  let supply = 100000;
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

  describe("Give Exchange Token", () => {
    it("Should approve the exchange to take all of the tokens", async () => {
      await token.approve(exchange.address, 100000);
    });

    it("Should give all tokens from the owner to the exchange", async () => {
      await expect(exchange.giveExchangeTokens()).to.changeTokenBalances(
        token,
        [owner.address, exchange.address],
        [-100000, 100000]
      );
    });
  });

  describe("Sell", () => {
    it("Should allow addr1 to buy one", async () => {
      await exchange.connect(addr1).buy(1, { value: 1000 });
    });

    it("Should fail if the sender didn't approve their tokens to be taken", async () => {
      await expect(exchange.connect(addr1).sell(1)).to.be.reverted;
    });

    it("Should allow the user to approve the selling of a token on the exchange", async () => {
      await token.connect(addr1).approve(exchange.address, 1);
    });

    it("Should allow the user to sell a token back to the exchange", async () => {
      await expect(exchange.connect(addr1).sell(1)).to.changeTokenBalances(
        token,
        [exchange.address, addr1.address],
        [1, -1]
      );
    });
  });

  describe("Buy", () => {
    it("Should reject if the proper amount of eth is included in the transaction", async () => {
      await expect(exchange.connect(addr1).buy(1, { value: 100 })).to.be
        .reverted;
    });
  });
});
