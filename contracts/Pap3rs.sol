pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

contract Pap3rs {

    string public _name;
    mapping(string => address) public contentOwners;

    constructor() {
        _name = "Pap3rs"; 
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function claim(string memory cid) public {
        contentOwners[cid] = msg.sender;
    }

    function getOwner(string memory cid) public view returns (address) {
        return contentOwners[cid];
    }

}
