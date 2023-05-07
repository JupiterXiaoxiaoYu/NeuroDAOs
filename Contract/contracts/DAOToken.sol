// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@thirdweb-dev/contracts/openzeppelin-presets/token/ERC20/ERC20.sol";
import "@thirdweb-dev/contracts/extension/interface/IBurnableERC20.sol";
import "@thirdweb-dev/contracts/extension/interface/IMintableERC20.sol";

contract DAOToken is ERC20, IBurnableERC20, IMintableERC20  {
    address public DAOAddress;
    constructor(
        string memory _name,
        string memory _symbol
    )
        ERC20(
            _name,
            _symbol
        )
    {
        DAOAddress = msg.sender;
    }

    error NotAuthorizedToMintOrBurn(address);
    error MintZeroTokens();
    error NotEnoughBalance();
    function burn(uint256 amount) external override {
        require(balanceOf(msg.sender) >= amount, "not enough balance");
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) external override {
        if(!_canMintOrBurn()){
            revert NotAuthorizedToMintOrBurn(msg.sender);
        }
        if(balanceOf(account) < amount){
            revert NotEnoughBalance();
        }
        _burn(account, amount);
    }

    function mintTo(address _to, uint256 _amount) public override {
        if(!_canMintOrBurn()){
            revert NotAuthorizedToMintOrBurn(msg.sender);
        }
        if(_amount==0){
            revert MintZeroTokens();
        }
        _mint(_to, _amount);
    }

    
    function transferFrom(address _from, address _to, uint256 _amount) public override returns(bool){
        if(!_canMintOrBurn()){
            revert NotAuthorizedToMintOrBurn(msg.sender);
        }
        _transfer(_from, _to, _amount);
        return true;
    }

    function _canMintOrBurn() internal view returns (bool) {
        return msg.sender == DAOAddress;
    }

}