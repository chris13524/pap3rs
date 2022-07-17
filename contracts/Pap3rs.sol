//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "hardhat/console.sol";

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract Pap3rs {

    string public _name;
    string[] private _cids;
    mapping(string => address) public contentOwners;
    mapping(string => mapping(address => uint256)) public tokenBalances;

    event DonationApproval(address indexed owner, address indexed spender, uint256 value);
    event Donation(address indexed donor, address indexed spender, uint256 value);

    constructor() {
        _name = "Pap3rs";
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function claim(string memory cid) public {
        require(contentOwners[cid] == address(0),"CID has already been submitted");
        contentOwners[cid] = msg.sender;
        _cids.push(cid);
    }

    function listCids() public view returns (string[] memory) {
        return _cids;
    }

    function getOwner(string memory cid) public view returns (address) {
        return contentOwners[cid];
    }

    function donate(string memory cid, address tokenContactAddress, uint256 amount) external {
        require(contentOwners[cid] != address(0),"CID must have been contributed to donate to");
        IERC20(tokenContactAddress).transferFrom(msg.sender, address(this), amount);
        tokenBalances[cid][tokenContactAddress] += amount;
    }

    function getDonationBalance(string memory cid,address tokenContactAddress) public view returns (uint256) {
        return tokenBalances[cid][tokenContactAddress];
    }

}
