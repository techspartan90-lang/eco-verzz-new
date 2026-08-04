// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EcoToken (ERC-20 Utility Token for EcoVerzz AI)
 * @notice Mints and manages utility rewards for verified waste recycling and clean tech investments.
 */
contract EcoToken {
    string public name = "EcoVerzz Token";
    string public symbol = "ECO";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
}
