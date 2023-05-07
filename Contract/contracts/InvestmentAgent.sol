// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
import "./WeightReputation.sol";
import "./DAOToken.sol";


contract InvestmentAgent {
    address public swapAddress;

    function investInSwapToken(address TokenAddress) internal {
        Swap(swapAddress).convertEthToTokens(TokenAddress);
    }

    function sellSwapToken(address TokenAddress) internal {
        ERC20(TokenAddress).approve(msg.sender,ERC20(TokenAddress).balanceOf(msg.sender));
        Swap(swapAddress).convertEthToTokens(TokenAddress);
    }

    function checkTokenPairExists(address TokenAddress) internal view returns (bool){
        return Swap(swapAddress).checkPairExists(TokenAddress);
    }

    
}
interface Swap{
    function convertEthToTokens(address tokenAddress) external payable;
    function convertTokensToEth(address tokenAddress) external payable;
    function checkPairExists(address tokenA) external view returns (bool);
}