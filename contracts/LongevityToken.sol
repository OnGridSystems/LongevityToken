pragma solidity ^0.4.19;


import "../zeppelin/contracts/token/ERC827/ERC827Token.sol";
import "../zeppelin/contracts/token/ERC20/BurnableToken.sol";
import "./MultiMintableToken.sol";
import "./MultiOwnable.sol";


contract LongevityToken is ERC827Token, MultiMintableToken, BurnableToken {
    string public name = "Longevity";
    string public symbol = "LTY";
    uint8 public decimals = 2;

    function LongevityToken() public MultiMintableToken() {}
}
