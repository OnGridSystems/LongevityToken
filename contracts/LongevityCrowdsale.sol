pragma solidity ^0.4.18;

import "./LongevityToken.sol";
import "./MultiOwnable.sol";
import "./MultiOracle.sol";

/**
 * @title Crowdsale
 * @dev Crowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ether. This contract implements
 * such functionality in its most fundamental form and can be extended to provide additional
 * functionality and/or custom behavior.
 * The external interface represents the basic interface for purchasing tokens, and conform
 * the base architecture for crowdsales. They are *not* intended to be modified / overriden.
 * The internal interface conforms the extensible and modifiable surface of crowdsales. Override 
 * the methods to add functionality. Consider using 'super' where appropiate to concatenate
 * behavior.
 */

contract LongevityCrowdsale is MultiOwnable, MultiOracle{
  using SafeMath for uint256;

  // The token being sold
  LongevityToken public token;

  // Address where funds are collected
  address public wallet;


  // Amount of wei raised
  uint256 public weiRaised;

  // Amount of USD cents raised
  uint256 public USDcRaised;

    // Minimum Deposit in USD cents
    uint256 public constant minContributionUSDc = 1000;

    // USD cents per ETH exchange rate
    uint256 public rateUSDcETH;

    // Bonus percent
    uint256 public constant bonusPercent = 40;

    // Crowdsale end time
    uint256 endTime;

  /**
   * Event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
    // event for rate update logging
    event RateUpdate(uint256 rate);
  /**
   * @param _rateUSDcETH Number of token units a buyer gets per wei
   * @param _wallet Address where collected funds will be forwarded to
   * @param _token Address of the token being sold
   */
  function LongevityCrowdsale(uint256 _rateUSDcETH, address _wallet, LongevityToken _token) public MultiOwnable() {
    require(_rateUSDcETH > 0);
    require(_wallet != address(0));
    require(_token != address(0));

      rateUSDcETH = _rateUSDcETH;
    wallet = _wallet;
    token = _token;
  }

  /**
   * @dev fallback function
   */
  function () external payable {
    buyTokens(msg.sender);
  }

  /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
   * @param _beneficiary Address performing the token purchase
   */
  function buyTokens(address _beneficiary) public payable {
      uint256 weiAmount = msg.value;
      require(_beneficiary != address(0));
      require(weiAmount != 0);
      uint256 USDcAmount = calculateUSDcAmount(weiAmount);
      require(USDcAmount >= minContributionUSDc);
      uint256 tokenAmount = calculateTokenAmount(weiAmount);

      // update state
      weiRaised = weiRaised.add(weiAmount);
      USDcRaised = USDcRaised.add(USDcAmount);

      token.transfer(_beneficiary, tokenAmount);
      TokenPurchase(msg.sender, _beneficiary, weiAmount, tokenAmount);

      wallet.transfer(msg.value);
  }

    // calculate deposit value in USD Cents
    function calculateUSDcAmount(uint256 _weiAmount) public view returns (uint256) {

        // wei per USD cent
        uint256 weiPerUSDc = 1 ether/rateUSDcETH;

        // Deposited value converted to USD cents
        uint256 depositValueInUSDc = _weiAmount.div(weiPerUSDc);
        return depositValueInUSDc;
    }

    // calculates how much tokens will beneficiary get
    // for given amount of wei
    function calculateTokenAmount(uint256 _weiAmount) public view returns (uint256) {
        uint256 mainTokens = calculateUSDcAmount(_weiAmount);
        uint256 bonusTokens = mainTokens.mul(bonusPercent).div(100);
        return mainTokens.add(bonusTokens);
    }
}
