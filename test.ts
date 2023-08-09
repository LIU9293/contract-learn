import { JsonRpcProvider, formatEther } from "ethers";

// get eth balance of a given address
const getBalance = async (address: string) => {
  const provider = new JsonRpcProvider("http://localhost:8545");
  const balance = await provider.getBalance(address);
  return formatEther(balance); 
}

async function main() {
  const res = await getBalance("0xfa895a28b991d5004ecdb0f36daa40d870e7bd3a")
  console.log(res)
}

main()