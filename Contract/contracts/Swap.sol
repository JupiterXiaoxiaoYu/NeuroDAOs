// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "https://github.com/Uniswap/uniswap-v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol";
import "@thirdweb-dev/contracts/openzeppelin-presets/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);
}

contract Swap {
    address internal constant UNISWAP_ROUTER_ADDRESS =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address internal constant UNISWAP_FACTORY_ADDRESS =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    IUniswapV2Router02 public uniswapRouter;
    IUniswapV2Factory public uniFactory;

    constructor() {
        uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
        uniFactory = IUniswapV2Factory(UNISWAP_FACTORY_ADDRESS);
    }

    function convertEthToTokens(address tokenAddress) external payable {
        uint256 deadline = block.timestamp + 15; // using 'now' for convenience, for mainnet pass deadline from frontend!
        uint256[] memory amountsOut = getEstimatedEReceivedToken(
            msg.value,
            tokenAddress
        );
        uniswapRouter.swapExactETHForTokens{value: msg.value}(
            amountsOut[amountsOut.length - 1],
            getPathForETHtoToken(tokenAddress),
            msg.sender,
            deadline
        );

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "refund failed");
    }

    function getEstimatedEReceivedToken(uint256 EthAmount, address tokenAddress)
        public
        view
        returns (uint256[] memory)
    {
        return
            uniswapRouter.getAmountsOut(
                EthAmount,
                getPathForETHtoToken(tokenAddress)
            );
    }

    function transferToken(address tokenAddress) public {
        uint256 tokenBalance = ERC20(tokenAddress).balanceOf(msg.sender);
        (bool successDelegateCall, ) = tokenAddress.delegatecall(
            abi.encodeWithSignature("approve(address,uint256)", UNISWAP_ROUTER_ADDRESS, tokenBalance)
        );
        require(successDelegateCall==true, "balance approved");
        // ERC20(tokenAddress).transferFrom(msg.sender, address(this), 1);
    }

    function convertTokensToEth(address tokenAddress) external payable {
        uint256 tokenBalance = ERC20(tokenAddress).balanceOf(msg.sender);
        // require(ERC20(tokenAddress).approve(address(this), tokenBalance), "approve failed.");
        require(ERC20(tokenAddress).transferFrom(msg.sender, address(this), tokenBalance), "transferFrom failed.");
        require(ERC20(tokenAddress).approve(address(UNISWAP_ROUTER_ADDRESS), tokenBalance), "approve failed.");
        uint256 deadline = block.timestamp + 15; // using 'now' for convenience, for mainnet pass deadline from frontend!
        uint256[] memory amountsOut = getEstimatedEReceivedEth(
            tokenBalance,
            tokenAddress
        );
        uniswapRouter.swapExactTokensForETH(
            tokenBalance,
            amountsOut[amountsOut.length - 1],
            getPathForTokentoETH(tokenAddress),
            msg.sender,
            deadline
        );

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "refund failed");
    }

    function getEstimatedEReceivedEth(uint256 tokenAmount, address tokenAddress)
        public
        view
        returns (uint256[] memory)
    {
        return
            uniswapRouter.getAmountsOut(
                tokenAmount,
                getPathForTokentoETH(tokenAddress)
            );
    }

    function getPathForETHtoToken(address tokenAddress)
        private
        view
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = tokenAddress;
        return path;
    }

    function getPathForTokentoETH(address tokenAddress)
        private
        view
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = tokenAddress;
        path[1] = uniswapRouter.WETH();
        return path;
    }

    using SafeMath for uint256;

    function getBalance(address tokenAddress) public view returns (uint256) {
        return ERC20(tokenAddress).balanceOf(msg.sender).div(10**18);
    }

    function checkPairExists(address tokenA) external view returns (bool) {
        address pair = uniFactory.getPair(tokenA, uniswapRouter.WETH());
        if (pair == 0x0000000000000000000000000000000000000000) {
            return false;
        } else {
            return true;
        }
    }

    // important to receive ETH
    receive() external payable {}
}
