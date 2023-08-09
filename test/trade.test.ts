import { ethers } from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json'

// Test Address: 0xB59c4A185DE0c3AF0769e3e39069f741887E932F
// Test USDT Contract: 0xB6434EE024892CBD8e3364048a259Ef779542475
const USDT = '0xB6434EE024892CBD8e3364048a259Ef779542475'
const WETH = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'

describe('Wallet', async () => {
  async function deployContracts() {
    const [owner, signer1, signer2] = await ethers.getSigners()

    // const gensisWallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", ethers.provider)
    // await gensisWallet.sendTransaction({
    //   to: owner.address,
    //   value: ethers.parseEther('5')
    // })
    
    const traderFactory = await ethers.getContractFactory('Trader')
    const traderContract = await traderFactory.deploy()
    console.log(`trader contract ${traderContract.target} created`)
    return { owner, signer1, signer2, traderContract }
  }

  describe('Trader test', async () => {
    // it('user store ETH and USDT into contract, then query balance', async () => {
    //   const { owner, traderContract } = await loadFixture(deployContracts)
    //   const contractAddress = traderContract.target

    //   // send ETH to contract
    //   const amount = ethers.parseEther('0.01')
    //   await owner.sendTransaction({
    //     to: contractAddress,
    //     value: amount
    //   })
      
    //   // send USDT to contract
    //   const usdtContract = await ethers.getContractAt(ERC20.abi, '0xB6434EE024892CBD8e3364048a259Ef779542475', owner)
    //   await usdtContract.transfer(contractAddress, amount)
      
    //   const contractUSDTBalance = await traderContract.getBalance('0xB6434EE024892CBD8e3364048a259Ef779542475')
    //   const contractETHBalance = await traderContract.getEthBalance()
    //   console.log(`eth balance ${contractETHBalance}, usdt balance ${contractUSDTBalance}`)

    //   expect(contractETHBalance).to.eq(amount)
    //   expect(contractUSDTBalance).to.eq(amount)

    //   console.log('withdraw all')
    //   await traderContract.withdrawToken('0xB6434EE024892CBD8e3364048a259Ef779542475')
    //   await traderContract.withdrawETH()

    //   const contractUSDTBalance2 = await traderContract.getBalance('0xB6434EE024892CBD8e3364048a259Ef779542475')
    //   const contractETHBalance2 = await traderContract.getEthBalance()

    //   console.log(`eth balance ${contractETHBalance2}, usdt balance ${contractUSDTBalance2}`)
    //   expect(contractETHBalance2).to.eq(ethers.parseEther('0'))
    //   expect(contractUSDTBalance2).to.eq(ethers.parseEther('0'))
    // })

    // it('test swap', async () => {
    //   const { owner, traderContract } = await loadFixture(deployContracts)
    //   const contractAddress = traderContract.target

    //   // send ETH to contract
    //   const wethAmount = ethers.parseEther('0.05')
    //   const usdtAmount = ethers.parseEther('0.5')

    //   // send USDT to contract
    //   const usdtContract = await ethers.getContractAt(ERC20.abi, USDT, owner)
    //   await usdtContract.transfer(contractAddress, usdtAmount)

    //   // send WETH to contract
    //   const wethContract = await ethers.getContractAt(ERC20.abi, WETH, owner)
    //   await wethContract.transfer(contractAddress, wethAmount)

    //   const ownerBalanceWETH = await traderContract.getBalanceForAddress(WETH, owner.address)
    //   const ownerBalanceUSDT = await traderContract.getBalanceForAddress(USDT, owner.address)
    //   console.log(`owner - weth balance ${ownerBalanceWETH}, usdt balance ${ownerBalanceUSDT}`)
      
    //   const contractUSDTBalance = await traderContract.getBalance(USDT)
    //   const contractWETHBalance = await traderContract.getBalance(WETH)
    //   console.log(`contract - weth balance ${contractWETHBalance}, usdt balance ${contractUSDTBalance}`)

    //   expect(contractWETHBalance).to.eq(wethAmount)
    //   expect(contractUSDTBalance).to.eq(usdtAmount)

    //   const swapAmount = ethers.parseEther('0.01')
    //   await traderContract.sellExactIn(swapAmount)
      
    //   const contractUSDTBalance2 = await traderContract.getBalance(USDT)
    //   const contractWETHBalance2 = await traderContract.getBalance(WETH)
    //   console.log(`after sell - contract - weth balance ${contractWETHBalance2}, usdt balance ${contractUSDTBalance2}`)
      
    //   expect(contractWETHBalance2 + swapAmount).to.eq(contractWETHBalance)
    //   expect(contractUSDTBalance2).to.gt(contractUSDTBalance)


    //   await traderContract.buyExactOut(swapAmount)

    //   const contractUSDTBalance3 = await traderContract.getBalance(USDT)
    //   const contractWETHBalance3 = await traderContract.getBalance(WETH)

    //   console.log(`after buy - contract - weth balance ${contractWETHBalance3}, usdt balance ${contractUSDTBalance3}`)
    //   expect(contractWETHBalance3).to.eq(contractWETHBalance3)
    //   expect(contractUSDTBalance3).to.lte(contractUSDTBalance)
    // })

    it('swap test 2', async () => {
      const { owner, traderContract } = await loadFixture(deployContracts)
      const contractAddress = traderContract.target

      // send ETH to contract
      const wethAmount = ethers.parseEther('0.05')
      const usdtAmount = ethers.parseEther('0.5')

      // send USDT to contract
      const usdtContract = await ethers.getContractAt(ERC20.abi, USDT, owner)
      await usdtContract.transfer(contractAddress, usdtAmount)

      // send WETH to contract
      const wethContract = await ethers.getContractAt(ERC20.abi, WETH, owner)
      await wethContract.transfer(contractAddress, wethAmount)


      const contractUSDTBalance = await traderContract.getBalance(USDT)
      const contractWETHBalance = await traderContract.getBalance(WETH)
      console.log(`contract - weth balance ${contractWETHBalance}, usdt balance ${contractUSDTBalance}`)

      expect(contractWETHBalance).to.eq(wethAmount)
      expect(contractUSDTBalance).to.eq(usdtAmount)
      await traderContract.roundTrade(ethers.parseEther('0.01'))

      const contractUSDTBalance2 = await traderContract.getBalance(USDT)
      const contractWETHBalance2 = await traderContract.getBalance(WETH)
      console.log(`after trade - contract - weth balance ${contractWETHBalance2}, usdt balance ${contractUSDTBalance2}`)

      expect(contractWETHBalance2).to.eq(contractWETHBalance)
      expect(contractUSDTBalance2).to.lt(contractUSDTBalance)
    })
  })
})
