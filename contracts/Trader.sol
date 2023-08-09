// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol";

// univ3 sepolia factory -> 0x0227628f3F023bb0B980b67D528571c95c6DaC1c

contract Trader {
    IV3SwapRouter public immutable swapRouter = IV3SwapRouter(0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E);

    address public owner;
    address public constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;
    address public constant USDT = 0xB6434EE024892CBD8e3364048a259Ef779542475;
    
    // pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getBalance(address tokenAddress) public view returns (uint256) {
        ERC20 token = ERC20(tokenAddress);
        return token.balanceOf(address(this));
    }
    
    function getEthBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getBalanceForAddress(address tokenAddress, address walletAddress) public view returns (uint256) {
        ERC20 token = ERC20(tokenAddress);
        return token.balanceOf(walletAddress);
    }

    function withdrawETH () public payable onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function withdrawToken (address tokenAddress) external payable onlyOwner() {
        ERC20 token = ERC20(tokenAddress);
        token.transfer(owner, token.balanceOf(address(this)));
    }

    function sellExactIn (uint256 amountIn) public returns (uint256 amountOut) {
        ERC20 token = ERC20(WETH);
        uint WETHBalance = token.balanceOf(address(this));
        require(WETHBalance >= amountIn, "Not enough WETH");

        TransferHelper.safeApprove(WETH, address(swapRouter), amountIn);
        IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter.ExactInputSingleParams({
            tokenIn: WETH,
            tokenOut: USDT,
            fee: poolFee,
            recipient: address(this),
            amountIn: amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function buyExactOut (uint256 amountOut) public returns (uint256 amountIn) {
        ERC20 token = ERC20(USDT);
        uint USDTBalance = token.balanceOf(address(this));
        TransferHelper.safeApprove(USDT, address(swapRouter), USDTBalance);
        IV3SwapRouter.ExactOutputSingleParams memory params = IV3SwapRouter.ExactOutputSingleParams({
            tokenIn: USDT,
            tokenOut: WETH,
            fee: poolFee,
            recipient: address(this),
            amountOut: amountOut,
            amountInMaximum: USDTBalance,
            sqrtPriceLimitX96: 0
        });

        amountIn = swapRouter.exactOutputSingle(params);
    }

    function roundTrade (uint256 amount) external {
        sellExactIn(amount);
        buyExactOut(amount);
    }

    event Received(address, uint);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }
}
