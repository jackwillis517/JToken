// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JToken is ERC20{
    constructor(uint256 initialSupply) ERC20("JToken", "JTK") {
        _mint(msg.sender, initialSupply);
    } 
}
