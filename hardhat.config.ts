import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      accounts: {
        mnemonic: "extra replace group copper gown hazard iron song unit wonder piece habit",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      }
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/Vyk5kTX_sYeuj6I5QKxHnE_gZ-KY1R01",
      accounts: {
        mnemonic: "extra replace group copper gown hazard iron song unit wonder piece habit",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      }
    }
  }
};

export default config;
