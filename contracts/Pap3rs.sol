//SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";

contract Pap3rs {

    ITablelandTables private _tableland;
    string private _baseURIString = "https://testnet.tableland.network/query?s=";
    string private _metadataTable;
    uint256 private _metadataTableId;
    string private _tablePrefix = "author";
    // someday we update this with a nuxt app that diplays x,y and
    // gives you the interface to move x,y.
    string private _externalURL = "not.implemented.com";

    string public _name;
    string[] private _cids;
    mapping(string => address) public contentOwners;
    mapping(string => mapping(address => uint256)) public tokenBalances;

    event DonationApproval(address indexed owner, address indexed spender, uint256 value);
    event Donation(address indexed donor, address indexed spender, uint256 value);

    constructor(address registry) {
        _name = "Pap3rs";

        // comment out rest of constructor if running localhost network.  TODO: will need to get tableland running locally
        // https://github.com/tablelandnetwork/local-tableland

        _tableland = ITablelandTables(registry);
        _metadataTableId = _tableland.createTable(
        address(this),
        string.concat(
          "CREATE TABLE ",
          _tablePrefix,
          "_",
          Strings.toString(block.chainid),
          " (cid text, name text);"
        )
      );

      _metadataTable = string.concat(
        _tablePrefix,
        "_",
        Strings.toString(block.chainid),
        "_",
        Strings.toString(_metadataTableId)
      );
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function tableName() public view returns (string memory) {
        return _metadataTable;
    }

    function upload(string memory cid, string memory authorName) public {
        require(contentOwners[cid] == address(0),"CID has already been submitted");
        contentOwners[cid] = msg.sender;
        _cids.push(cid);

        _tableland.runSQL(
          address(this),
          _metadataTableId,
          string.concat(
            "INSERT INTO ",
            _metadataTable,
            " (cid, name) VALUES (",
            cid,
            ", '",
            authorName,
            "')"
          )
        );
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
