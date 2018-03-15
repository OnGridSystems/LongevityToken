pragma solidity ^0.4.18;

import "./MultiOwnable.sol";
import "../zeppelin/contracts/math/SafeMath.sol";

/**
 * @title PriceOracle
 * @dev The PriceOracle contract allows external entity (Oracle) updating ETH price (exchange rate)
 * to keep the USD-based token emission
 */
contract PriceOracle is MultiOwnable {
    using SafeMath for uint256;
    mapping(address => bool) public priceOracles;
    uint256 public priceUSDcETH;

    event PriceOracleAdded(address indexed newOwner);
    event PriceOracleRemoved(address indexed removedOwner);
    event PriceUpdated(address indexed priceOracle, uint256 price);

    /**
     * @param _priceUSDcETH the starting exchange rate
     */
    function PriceOracle(uint256 _priceUSDcETH) public MultiOwnable() {
        require(_priceUSDcETH > 0);
        priceUSDcETH = _priceUSDcETH;
    }


    /**
     * @dev Throws if called by any account other than the PriceOracle.
     */
    modifier onlyPriceOracle() {
        require(priceOracles[msg.sender]);
        _;
    }

    /**
     * @dev Adds oracle role to address
     * @param _address The address that will get oracle privileges
     * (external oracle script sends transactions from this account)
     */
    function addOracle(address _address) onlyOwner public {
        require(_address != address(0));
        priceOracles[_address] = true;
        PriceOracleAdded(_address);
    }

    /**
     * @dev Removes oracle role from the given address
     * @param _address The address to revoke oracle privileges
     */
    function delOracle(address _address) onlyOwner public {
        priceOracles[_address] = false;
        PriceOracleRemoved(_address);
    }

    /**
     * @dev Sets current ETHereum price (exchange rate).
     * This function called by price oracle script which runs on service backend
     * and constantly monitors exchanges for ETH/USD rate changes
     * @param _priceUSDcETH Current ETHereum price in USD cents
     */
    function setPrice(uint256 _priceUSDcETH) public onlyPriceOracle {
        // don't allow to change USDc per ETH price more than 10%
        assert(_priceUSDcETH < priceUSDcETH.mul(110).div(100));
        assert(_priceUSDcETH > priceUSDcETH.mul(90).div(100));
        priceUSDcETH = _priceUSDcETH;
        PriceUpdated(msg.sender, priceUSDcETH);
    }

}
