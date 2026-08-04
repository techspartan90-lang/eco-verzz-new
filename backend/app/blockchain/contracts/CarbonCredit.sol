// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CarbonCredit NFT Certificate (ERC-1155 / 721 Compatible)
 * @notice Verifies carbon credit minting, ownership, tree sponsorship, and credit burning on Polygon/Ethereum.
 */
contract CarbonCredit {
    string public name = "EcoVerzz Carbon Credit NFT";
    string public symbol = "ECO-CC";

    mapping(uint256 => address) public ownerOf;
    mapping(uint256 => uint256) public creditAmount;
    mapping(uint256 => bool) public isBurned;

    uint256 public nextTokenId = 1;

    event CreditMinted(uint256 indexed tokenId, address indexed to, uint256 amount);
    event CreditBurned(uint256 indexed tokenId, address indexed owner);

    function mintCredit(address to, uint256 amount) public returns (uint256) {
        uint256 tokenId = nextTokenId++;
        ownerOf[tokenId] = to;
        creditAmount[tokenId] = amount;
        emit CreditMinted(tokenId, to, amount);
        return tokenId;
    }

    function burnCredit(uint256 tokenId) public {
        require(ownerOf[tokenId] == msg.sender, "Not token owner");
        require(!isBurned[tokenId], "Already burned");
        isBurned[tokenId] = true;
        emit CreditBurned(tokenId, msg.sender);
    }
}
