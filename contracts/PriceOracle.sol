pragma solidity ^0.4.18;

import "./MultiOwnable.sol";

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract PriceOracle is MultiOwnable {
  mapping (address => bool) public oracles;
  // USD cents per ETH exchange price
  uint256 public priceUSDcETH;

  event PriceOracleAdded(address indexed newOwner);
  event PriceOracleRemoved(address indexed removedOwner);
  // event for price update logging
  event PriceUpdate(uint256 price);

  /**
 * @param _priceUSDcETH Number of token units a buyer gets per wei
 */
  function PriceOracle(uint256 _priceUSDcETH) public MultiOwnable() {
    require(_priceUSDcETH > 0);
    priceUSDcETH = _priceUSDcETH;
  }


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
    PriceOracleAdded(_address);
  }

  /**
   * @dev Removes administrative role from address
   * @param _address The address to remove administrative privileges from
   */
  function delOracle(address _address) onlyOwner public {
    oracles[_address] = false;
    PriceOracleRemoved(_address);
  }

}
