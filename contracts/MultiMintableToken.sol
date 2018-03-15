pragma solidity ^0.4.18;

import "../zeppelin/contracts/token/ERC20/StandardToken.sol";
import "./MultiOwnable.sol";


/**
 * @title MultiMintableToken is a mintable token with multiple miners.
 * minters can be added and deleted.
 * @dev Based on OpenZeppelin simple ERC20 Token example, with mintable token creation
 * @dev Issue: * https://github.com/OpenZeppelin/zeppelin-solidity/issues/120
 * Based on code by TokenMarketNet: https://github.com/TokenMarketNet/ico/blob/master/contracts/MintableToken.sol
 */
contract MultiMintableToken is StandardToken, MultiOwnable {
    event Minted(address indexed to, uint256 amount);
    event MintFinished();
    event MinterAdded(address indexed newMinter);
    event MinterRemoved(address indexed removedMinter);

    bool public mintingFinished = false;
    mapping(address => bool) public minters;

    function MultiMintableToken() public MultiOwnable() {}

    modifier canMint() {
        require(!mintingFinished);
        _;
    }

    /**
     * @dev Throws if called by any account other than the minter.
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
    function mint(address _to, uint256 _amount) public onlyMinter canMint returns (bool) {
        totalSupply_ = totalSupply_.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        Minted(_to, _amount);
        Transfer(address(0), _to, _amount);
        return true;
    }

    /**
     * @dev Function to stop minting new tokens.
     * @return True if the operation was successful.
     */
    function finishMinting() public onlyOwner canMint returns (bool) {
        mintingFinished = true;
        MintFinished();
        return true;
    }

    /**
     * @dev Function to add minter role to given address
     * @param _address The address that will get minter privileges
     */
    function addMinter(address _address) public onlyOwner {
        require(_address != address(0));
        minters[_address] = true;
        MinterAdded(_address);
    }

    /**
     * @dev Function to remove minter role to given address
     * @param _address The address to revoke minter privileges
     */
    function delMinter(address _address) public onlyOwner {
        minters[_address] = false;
        MinterRemoved(_address);
    }
}