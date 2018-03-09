pragma solidity ^0.4.18;

import "../zeppelin/contracts/token/ERC20/StandardToken.sol";
import "./MultiOwnable.sol";


/**
 * @title Mintable token
 * @dev Simple ERC20 Token example, with mintable token creation
 * @dev Issue: * https://github.com/OpenZeppelin/zeppelin-solidity/issues/120
 * Based on code by TokenMarketNet: https://github.com/TokenMarketNet/ico/blob/master/contracts/MintableToken.sol
 */
contract MultiMintableToken is StandardToken, MultiOwnable {
  event Mint(address indexed to, uint256 amount);
  event MintFinished();
  event MinterAdded(address indexed newMinter);
  event MinterRemoved(address indexed removedMinter);

  bool public mintingFinished = false;
  mapping (address => bool) public minters;

  function MultiMintableToken() MultiOwnable() public {}


  modifier canMint() {
    require(!mintingFinished);
    _;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyMinter() {
    require(minters[msg.sender]);
    _;
  }

  /**
   * @dev Function to mint tokens
   * @param _to The address that will receive the minted tokens.
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(address _to, uint256 _amount) onlyMinter canMint public returns (bool) {
    totalSupply_ = totalSupply_.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    Transfer(address(0), _to, _amount);
    return true;
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting() onlyOwner canMint public returns (bool) {
    mintingFinished = true;
    MintFinished();
    return true;
  }


  /**
   * @dev Adds administrative role to address
   * @param _address The address that will get administrative privileges
   */
  function addMinter(address _address) onlyOwner public {
    require(_address != address(0));
    minters[_address] = true;
    MinterAdded(_address);
  }

  /**
   * @dev Removes administrative role from address
   * @param _address The address to remove administrative privileges from
   */
  function delMinter(address _address) onlyOwner public {
    minters[_address] = false;
    MinterRemoved(_address);
  }
}
