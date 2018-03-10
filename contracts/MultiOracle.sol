pragma solidity ^0.4.18;

import "./MultiOwnable.sol";

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract MultiOracle is MultiOwnable {
  mapping (address => bool) public oracles;


  event OracleAdded(address indexed newOwner);
  event OracleRemoved(address indexed removedOwner);


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOracle() {
    require(oracles[msg.sender]);
    _;
  }

  /**
   * @dev Adds administrative role to address
   * @param _address The address that will get administrative privileges
   */
  function addOracle(address _address) onlyOracle public {
    require(_address != address(0));
    oracles[_address] = true;
    OracleAdded(_address);
  }

  /**
   * @dev Removes administrative role from address
   * @param _address The address to remove administrative privileges from
   */
  function delOracle(address _address) onlyOwner public {
    oracles[_address] = false;
    OracleRemoved(_address);
  }

}
