pragma solidity ^0.4.18;

import "./LongevityToken.sol";
import "./MultiOwnable.sol";
import "./PriceOracle.sol";


/**
 * @title LongevityCrowdsale
 * @dev LongevityCrowdsale is a contract for managing a Longevity project token crowdsale,
 * allowing investors to purchase its tokens with ether.
 */
contract LongevityCrowdsale is MultiOwnable, PriceOracle {
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
    uint256 public minContributionUSDc = 10000;


    // Bonus percent
    uint256 public bonusPercent = 40;


    /**
     * Event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param beneficiary who got the tokens
     * @param value weis paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
    
    /**
     * @param _priceUSDcETH ETH price in USD cents (updated by external entity called Oracle)
     * @param _wallet Address where collected funds will be forwarded to
     * @param _token Address of the token being sold
     */
    function LongevityCrowdsale(uint256 _priceUSDcETH, address _wallet, LongevityToken _token)
    public PriceOracle(_priceUSDcETH) {
        require(_wallet != address(0));
        require(_token != address(0));
        wallet = _wallet;
        token = _token;
    }

    /**
     * @dev fallback function receivint ETH transferred to this contract.
     */
    function() external payable {
        buyTokens(msg.sender);
    }

    /**
     * @dev buyTokens is a low level token purchase function. Calculates USD value of deposit?
     * mints corresponding amount of tokens and transfers ethers to external wallet
     * @param _beneficiary Address performing the token purchase
     */
    function buyTokens(address _beneficiary) public payable {
        uint256 weiAmount = msg.value;
        require(_beneficiary != address(0));
        require(weiAmount != 0);
        uint256 USDcAmount = calculateUSDcAmount(weiAmount);
        require(USDcAmount >= minContributionUSDc);
        uint256 tokenAmount = calculateTokenAmount(weiAmount);
        weiRaised = weiRaised.add(weiAmount);
        USDcRaised = USDcRaised.add(USDcAmount);
        token.mint(_beneficiary, tokenAmount);
        TokenPurchase(msg.sender, _beneficiary, weiAmount, tokenAmount);
        wallet.transfer(msg.value);
    }

    /**
     * @dev calculateUSDcAmount converts deposited value to USD cents based on current USD price
     * @param _weiAmount how much wei deposited
     */
    function calculateUSDcAmount(uint256 _weiAmount) public view returns (uint256) {
        uint256 weiPerUSDc = 1 ether / priceUSDcETH;
        uint256 depositValueInUSDc = _weiAmount.div(weiPerUSDc);
        return depositValueInUSDc;
    }

    /**
     * @dev calculateTokenAmount converts deposited value to corresponding amount of tokens
     * using current bonus percent
     * @param _weiAmount how much wei deposited
     */
    function calculateTokenAmount(uint256 _weiAmount) public view returns (uint256) {
        uint256 mainTokens = calculateUSDcAmount(_weiAmount);
        uint256 bonusTokens = mainTokens.mul(bonusPercent).div(100);
        return mainTokens.add(bonusTokens);
    }
}