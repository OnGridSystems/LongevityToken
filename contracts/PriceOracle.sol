pragma solidity ^0.4.18;

import "./MultiOwnable.sol";
import "../zeppelin/contracts/math/SafeMath.sol";

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract PriceOracle is MultiOwnable {
    using SafeMath for uint256;
    mapping(address => bool) public priceOracles;

    // USD cents per ETH exchange price
    uint256 public priceUSDcETH;

    event PriceOracleAdded(address indexed newOwner);
    event PriceOracleRemoved(address indexed removedOwner);
    event PriceUpdated(address indexed priceOracle, uint256 price);

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
    modifier onlyPriceOracle() {
        require(priceOracles[msg.sender]);
        _;
    }

    /**
     * @dev Adds administrative role to address
     * @param _address The address that will get administrative privileges
     */
    function addOracle(address _address) onlyOwner public {
        require(_address != address(0));
        priceOracles[_address] = true;
        PriceOracleAdded(_address);
    }

    /**
     * @dev Removes administrative role from address
     * @param _address The address to remove administrative privileges from
     */
    function delOracle(address _address) onlyOwner public {
        priceOracles[_address] = false;
        PriceOracleRemoved(_address);
    }

    // set price
    function setPrice(uint256 _priceUSDcETH) public onlyPriceOracle {
        // don't allow to change USDc per ETH price more than 10%
        assert(_priceUSDcETH < priceUSDcETH.mul(110).div(100));
        assert(_priceUSDcETH > priceUSDcETH.mul(90).div(100));
        priceUSDcETH = _priceUSDcETH;
        PriceUpdated(msg.sender, priceUSDcETH);
    }

}
