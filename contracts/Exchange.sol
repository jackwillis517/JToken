// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Exchange {
    IERC20 public token;
    uint256 price;
    address owner;

    constructor(IERC20 _token, uint256 _price) {
        token = _token;
        price = _price;
        owner = msg.sender;
    }

    function giveExchangeTokens() external {
        require(msg.sender == owner);
        uint256 allowance = token.allowance(msg.sender, address(this));
        bool sent = token.transferFrom(msg.sender, address(this), allowance);
        require(sent, "Failed to send tokens to the exchange");
    }

    function sell(uint256 amount) external payable {
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(
            token.balanceOf(msg.sender) >= amount,
            "You don't have that many tokens to sell."
        );
        require(
            allowance == amount,
            "You didn't permit the exchange to take this many tokens from you."
        );
        bool tokensTaken = token.transferFrom(
            msg.sender,
            address(this),
            allowance
        );
        assert(tokensTaken);
        (bool sent, ) = payable(msg.sender).call{value: viewPrice(amount)}("");
        assert(sent);
    }

    function buy(uint256 amount) external payable {
        require(
            token.balanceOf(address(this)) >= amount,
            "Not enough tokens left."
        );
        require(msg.value == viewPrice(amount), "Insufficent funds.");
        token.transfer(msg.sender, amount);
    }

    function viewPrice(uint256 amount) public view returns (uint256) {
        return amount * price;
    }

    function viewApproved() external view returns (uint256) {
        return token.allowance(msg.sender, address(this));
    }

    function viewBalance() external view returns (uint256) {
        return token.balanceOf(msg.sender);
    }
}
