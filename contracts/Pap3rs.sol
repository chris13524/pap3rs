//SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";

contract Pap3rs {
    ITablelandTables private _tableland;
    string private _baseURIString =
        "https://testnet.tableland.network/query?s=";
    string private _metadataTable;
    uint256 private _metadataTableId;
    string private _tablePrefix = "author";
    // someday we update this with a nuxt app that diplays x,y and
    // gives you the interface to move x,y.
    string private _externalURL = "not.implemented.com";

    // string public _name;
    string[] private _cids;
    mapping(string => address) public contentOwners;
    mapping(string => mapping(address => uint256)) public tokenBalances;

    event DonationApproval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Donation(
        address indexed donor,
        address indexed spender,
        uint256 value
    );

    event NewAuthor(string name, address addr);
    // event NewAuthor(string cid);

    event PublishPaper(
        address[] authors,
        string title,
        string description,
        string content,
        string contentFileName,
        string[] references,
        string[] reviews
    );

    // event PublishPaper(string cid);

    constructor(address registry) {
        // _name = "Pap3rs";
        // comment out rest of constructor if running localhost network.  TODO: will need to get tableland running locally
        // https://github.com/tablelandnetwork/local-tableland
        //   _tableland = ITablelandTables(registry);
        //   _metadataTableId = _tableland.createTable(
        //   address(this),
        //   string.concat(
        //     "CREATE TABLE ",
        //     _tablePrefix,
        //     "_",
        //     Strings.toString(block.chainid),
        //     " (cid text, name text);"
        //   )
        // );
        // _metadataTable = string.concat(
        //   _tablePrefix,
        //   "_",
        //   Strings.toString(block.chainid),
        //   "_",
        //   Strings.toString(_metadataTableId)
        // );
    }

    // function name() public view returns (string memory) {
    //     return _name;
    // }

    function tableName() public view returns (string memory) {
        return _metadataTable;
    }

    function newAuthor(string memory authorName, address addr) public {
        emit NewAuthor(authorName, addr);
    }

    function upload(
        address[] memory authors,
        string memory title,
        string memory description,
        string memory content,
        string memory contentFileName,
        string[] memory references,
        string[] memory reviews
    ) public {
        require(
            contentOwners[content] == address(0),
            "CID has already been submitted"
        );
        contentOwners[content] = msg.sender;
        _cids.push(content);

        // _tableland.runSQL(
        //   address(this),
        //   _metadataTableId,
        //   string.concat(
        //     "INSERT INTO ",
        //     _metadataTable,
        //     " (cid, name) VALUES (",
        //     cid,
        //     ", '",
        //     authorName,
        //     "')"
        //   )
        // );

        emit PublishPaper(
            authors,
            title,
            description,
            content,
            contentFileName,
            references,
            reviews
        );
    }

    function listCids() public view returns (string[] memory) {
        console.log("listCids() returns: %s", "sdfdsfdsfdf");
        return _cids;
    }

    function getOwner(string memory cid) public view returns (address) {
        address cidOwner = contentOwners[cid];
        console.log("getOwner(%s) returns: %s", cid, cidOwner);
        return cidOwner;
    }

    function donate(
        string memory cid,
        address tokenContactAddress,
        uint256 amount
    ) external {
        console.log("%s will donate %s to %s", msg.sender, amount, cid);
        require(
            contentOwners[cid] != address(0),
            "CID must have been contributed to donate to"
        );
        IERC20(tokenContactAddress).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        tokenBalances[cid][tokenContactAddress] += amount;
    }

    function withdraw(
        string memory cid,
        address tokenContactAddress,
        uint256 amount
    ) external {
        require(
            contentOwners[cid] == msg.sender,
            "Only the owner of this cid can withdraw donations"
        );
        uint256 balance = tokenBalances[cid][tokenContactAddress];
        require(balance >= amount, "Insufficient balance for withdrawal");
        tokenBalances[cid][tokenContactAddress] -= amount;
        IERC20(tokenContactAddress).transfer(msg.sender, amount);
    }

    function getDonationBalance(string memory cid, address tokenContractAddress)
        public
        view
        returns (uint256)
    {
        uint256 balance = tokenBalances[cid][tokenContractAddress];
        console.log(
            "request for token balance for cid=%s on token %s = %s",
            cid,
            tokenContractAddress,
            balance
        );
        return balance;
    }
}
