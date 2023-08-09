// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
// import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
// import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract Trader {
    address public owner;

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

    event Received(address, uint);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }
}
