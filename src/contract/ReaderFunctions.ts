import { ethers } from 'ethers';
import store from '../stores';
import { ABI, bitfighter_contract_adress } from "./bitfighter_constants";
import { WBTC_ADDRESS } from './wBTC_constant';

export class ReaderFunctions {
  // static provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc_testnet_chapel/87a9699a7587944dae8582a3999c71f8da7539eb18710b26fa781ffb1f48288d")
  static provider = new ethers.providers.Web3Provider(window.ethereum)
  static readOnlyContract: ethers.Contract = new ethers.Contract(bitfighter_contract_adress, ABI, this.provider);
  // static readOnlyWBTCContract: ethers.Contract = new ethers.Contract(WBTC_ADDRESS, ABI, ReaderFunctions.provider);
  
  // public static async getContractName() {
  //   console.log("here........")
  //   const name = await ReaderFunctions.readOnlyContract.name();
  //   console.log("name  --> ", name);
  //   return name;
  // }

  // public static async getBalanceWbtc(address: string) {
  //   console.log("here........")
  //   const name = await this.readOnlyWBTCContract.balanceOf(address);
  //   console.log("name  --> ", name);
  //   return {
  //     balance: name,
  //     decimals: "18",
  //   }
  // }

  public static async fetchTokenOfUserFromSC() {
    const tokenIds = await this.readOnlyContract.getTokensOfUser(store.getState().web3store.userAddress)
    console.log("______debug_tokenIds____", tokenIds)
    return tokenIds;
  }
}
