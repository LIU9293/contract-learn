import { Contract, JsonRpcProvider, formatEther, Wallet, parseEther } from "ethers";

const abi = [
  "function roundTrade(uint256 amount) external",
]

// get eth balance of a given address
const getBalance = async (address: string) => {
  const provider = new JsonRpcProvider("http://localhost:8545");
  const balance = await provider.getBalance(address);
  return formatEther(balance); 
}

async function main() {
  const provider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/Vyk5kTX_sYeuj6I5QKxHnE_gZ-KY1R01");
  const signer = Wallet.fromPhrase("extra replace group copper gown hazard iron song unit wonder piece habit").connect(provider);

  const traderContract = new Contract("0xDA0Fcc814C83f38306E9b2d2FeeBcc0Ee8a6faE6", abi, signer);
  await traderContract.roundTrade(parseEther("0.01"));
}

main()

// test contract address on sepolia: 0xDA0Fcc814C83f38306E9b2d2FeeBcc0Ee8a6faE6 