import { ethers } from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json'

// Test Address: 0xB59c4A185DE0c3AF0769e3e39069f741887E932F
// Test USDT Contract: 0xB6434EE024892CBD8e3364048a259Ef779542475

describe('Wallet', async () => {
  async function deployContracts() {
    const [owner, signer1, signer2] = await ethers.getSigners()
    const traderFactory = await ethers.getContractFactory('Trader')
    const traderContract = await traderFactory.deploy()
    console.log(`trader contract ${traderContract.target} created`)
    return { owner, signer1, signer2, traderContract }
  }

  describe('Trader test', async () => {
    it('user store ETH and USDT into contract, then query balance', async () => {
      const { owner, traderContract } = await loadFixture(deployContracts)
      const contractAddress = traderContract.target

      // send ETH to contract
      const amount = ethers.parseEther('0.01')
      await owner.sendTransaction({
        to: contractAddress,
        value: amount
      })
      
      // send USDT to contract
      const usdtContract = await ethers.getContractAt(ERC20.abi, '0xB6434EE024892CBD8e3364048a259Ef779542475', owner)
      await usdtContract.transfer(contractAddress, amount)
      
      const contractUSDTBalance = await traderContract.getBalance('0xB6434EE024892CBD8e3364048a259Ef779542475')
      const contractETHBalance = await traderContract.getEthBalance()
      console.log(`eth balance ${contractETHBalance}, usdt balance ${contractUSDTBalance}`)

      expect(contractETHBalance).to.eq(amount)
      expect(contractUSDTBalance).to.eq(amount)

      console.log('withdraw all')
      await traderContract.withdrawToken('0xB6434EE024892CBD8e3364048a259Ef779542475')
      await traderContract.withdrawETH()

      const contractUSDTBalance2 = await traderContract.getBalance('0xB6434EE024892CBD8e3364048a259Ef779542475')
      const contractETHBalance2 = await traderContract.getEthBalance()

      console.log(`eth balance ${contractETHBalance2}, usdt balance ${contractUSDTBalance2}`)
      expect(contractETHBalance2).to.eq(ethers.parseEther('0'))
      expect(contractUSDTBalance2).to.eq(ethers.parseEther('0'))
    })
  })
})
