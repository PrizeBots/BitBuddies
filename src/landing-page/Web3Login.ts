import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT';
import { setNFTDetails, setNFTLoadedBool, setTotalNFTData } from '../stores/BitFighters';
import { validation } from '../utils/Validation';
import { ethers } from "ethers";
import { ChangeAuthTOken, ChangeLoggerMessage, ChangeUserData, ChangeValidUserState, USER_DETAILS } from '../stores/UserWebsiteStore';
import { checkIfUserSignedMetamask, fetchNFTsFromDB, fetchUserDetails, loginAndAuthenticateUser, postUserSignedMessage } from '../hooks/ApiCaller';
import store from '../stores';
import { Login, SetConnectedWeb3 } from '../stores/Web3Store';
import MetaMaskOnboarding from '@metamask/onboarding';
import detectEthereumProvider from '@metamask/detect-provider'
import { FetchDripPresaleInfoMintedByUser, getBalances, updateBitfightersMintedCountAndTotal, updateDripPresaleMintedCount, updateOneKClubMintedCount, updatePresaleMintedCount } from '../utils/web3_utils';
import { setCardState } from '../stores/MintCardStateStore';
import { PageStates } from './components/SidePanel/SidePanel';
import {Buffer} from 'buffer';
// import {
//   recoverPersonalSignature,
// } from '@metamask/eth-sig-util';

// import { SetWbtcBalance } from '../stores/Web3StoreBalances';
// import WalletConnectProvider from "@walletconnect/web3-provider";

//
// const from = accounts[0];
//       const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
//       const sign = personalSignResult.innerHTML;
//       const recoveredAddr = recoverPersonalSignature({
//         data: msg,
//         sig: sign,
//       });
//

declare global {
  interface Window{
    ethereum?:any
  }
}

const siweSign = async (accounts: Array<string>, siweMessage: string) => {
  console.log("in siweSign")
  try {
    const from = accounts[0];
    // const hashedMessage = Web3.utils.sha3(message);
    const msg = `0x${Buffer.from(siweMessage, 'utf8').toString('hex')}`;
    const sign = await window.ethereum.request({
      method: 'personal_sign',
      params: [msg, from],
    });
    console.log("in siweSign ", sign)
    return sign;
  } catch (err) {
    console.error("error in siweSign" ,err);
    return "Error";
  }
};

// const verifyMetamaskSignature = async (accounts: Array<string>, message: string, sign: string) => {
//   const from = accounts[0];
//   const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
//   const recoveredAddr = recoverPersonalSignature({
//     data: msg,
//     signature: sign,
//   });
//   console.log("in siweSign ", recoveredAddr)
// }

const SignatureMessage = "By participating in this game you are acknowledging that you have read, understood, and agree to be bound by the terms and conditions found here: www.BitFighters.club/termsandconditions Failure to comply with these terms and conditions may result in, but will not be limited to, disqualification from participation in the game and the forfeiture of your account and all associated game assets."

export async function Web3Login() {
  console.log("in web3login ", window.ethereum)
  const onboarding = new MetaMaskOnboarding();

  if (!store.getState().userPathStore.metaMaskInstalled) {
    onboarding.startOnboarding()
    return;
  }
  console.log("in web3login ....(*******", process.env.REACT_APP_DEV_ENV)
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork();
  if (process.env.REACT_APP_DEV_ENV === "production") {
    const SUPPORTED_CHAINIDS = [43114];
    const SUPPORTED_NETWORK_LONG ="Avalanche Network";
    console.log("in web3login ....*******", network.name, process.env.NODE_ENV)
    if (SUPPORTED_CHAINIDS.indexOf(network.chainId) === -1) {
      if (window.confirm(`Only ${SUPPORTED_NETWORK_LONG} networks are currently supported. Should we switch to ${SUPPORTED_NETWORK_LONG}?`) == true) {
          const check = await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId: "0xA86A",
                rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
                chainName: "Avalanche Network",
                nativeCurrency: {
                    name: "AVAX",
                    symbol: "AVAX",
                    decimals: 18
                },
                blockExplorerUrls: ["https://snowtrace.io/"]
            }]
          });
          console.log("check..", check)
        } else {
          return;
        }
    }
  } else {
    // const SUPPORTED_NETWORKS = ["bnbt"];
    const SUPPORTED_CHAINIDS = [43113];
    const SUPPORTED_NETWORK_LONG ="AVAX Testnet";
    console.log("in web3login ....(*******", network.name, network.chainId, process.env.NODE_ENV)
    if (SUPPORTED_CHAINIDS.indexOf(network.chainId) === -1) {
      if (window.confirm(`Only ${SUPPORTED_NETWORK_LONG} networks are currently supported. Should we switch to AVAX Network?`) == true) {
          const check = await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId: "0xA869",
                rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
                chainName: "Avalanche Testnet C-Chain",
                nativeCurrency: {
                    name: "AVAX",
                    symbol: "AVAX",
                    decimals: 18
                },
                blockExplorerUrls: ["https://testnet.snowtrace.io/"]
            }]
            // params: [{
            //     chainId: "0x61",
            //     rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            //     chainName: "Smart Chain - Testnet",
            //     nativeCurrency: {
            //         name: "BNB",
            //         symbol: "BNB",
            //         decimals: 18
            //     },
            //     blockExplorerUrls: ["https://testnet.bscscan.com"]
            // }]
            // params: [{
            //     chainId: "0x13881",
            //     rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
            //     chainName: "Matic Testnet",
            //     nativeCurrency: {
            //         name: "MATIC",
            //         symbol: "MATIC",
            //         decimals: 18
            //     },
            //     blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
            // }]
          });
          console.log("check..", check)
        } else {
          return;
        }
    }
  }
  const accounts = await provider.send("eth_requestAccounts", []);

  // check if signature exist in DB
  const userMetamaskSigned = await checkIfUserSignedMetamask(accounts[0]);
  console.log("Validation before siweSign -- ", userMetamaskSigned)
  if (!userMetamaskSigned) {
    const signedRes = await siweSign(accounts, SignatureMessage)
    if ( signedRes === "Error"){
      window.alert("Failed Metamask signature. Without that you cannot play.")
      return 
    }
    // post data to db
    postUserSignedMessage(accounts[0], signedRes);
    // verifyMetamaskSignature(accounts[0], SignatureMessage, signedRes)
  }
  
  
  localStorage.setItem("connected_matic_network", "10")
  console.log("-------accounts---- .",);
  console.log(accounts[0]);
  console.log("----------- .",);
  if (!validation(accounts[0])) {
    store.dispatch(ChangeValidUserState(false))
    return;
  }
  store.dispatch(Login(accounts[0]));
  store.dispatch(setCardState(PageStates.ProgressState))
  store.dispatch(ChangeValidUserState(true))

  // check if user owns 1k club card - prod
  

  const auth_token: string = await loginAndAuthenticateUser(accounts[0]);
  store.dispatch(ChangeAuthTOken(auth_token)); 

  const result = await fetchNFTsFromDB(accounts[0]);
  // console.log(accounts[0]);
  console.log("in web3login fetchNFTsFromDB ", result)
  const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
  store.dispatch(setTotalNFTData(result.message))
  store.dispatch(setNFTDetails(dataOfNFTS))
  store.dispatch(setNFTLoadedBool(true))
  store.dispatch(Login(accounts[0]));
  store.dispatch(SetConnectedWeb3(true));

  

  // const user_all_data: USER_DETAILS = await fetchUserDetails();
  // store.dispatch(ChangeUserData(user_all_data)); 



  await getBalances(store.getState().web3store.userAddress);

  // update nfts infos
  await updateBitfightersMintedCountAndTotal()
  // await updatePresaleMintedCount()
  // await updateOneKClubMintedCount()

  // await updateDripPresaleMintedCount()
  // await FetchDripPresaleInfoMintedByUser()



  // console.log("--- balance ", wbtcBalance, walletBalance, betBalance);
  // store.dispatch(SetWbtcBalance(wbtcBalance.toString()));


  // const {balance, decimals} = await ReaderFunctions.getBalanceWbtc(accounts[0])
  // console.log("--------bal--- .", balance, decimals, (parseFloat(balance)/(10 ** parseInt(decimals))).toString());
  // store.dispatch(ChangewbtcBalance((parseFloat(balance)/(10 ** parseInt(decimals))).toString()));
  // console.log("----------- .",);
  // console.log(accounts[0]);
  // console.log("----------- .",);
  // store.dispatch(ChangeMaticBalance(ethers.utils.formatEther(await provider.getBalance(accounts[0]))));
}

function handleEthereum() {
  const { ethereum } = window;
  if (ethereum && ethereum.isMetaMask) {
    console.log('Ethereum successfully detected!');
    store.dispatch(ChangeLoggerMessage("Ethereum successfully detected!"))
    // Access the decentralized web!
  } else {
    console.log('Please install MetaMask!');
    store.dispatch(ChangeLoggerMessage("Please install MetaMask!"))
  }
}

export async function PhoneWeb3Login() {
  console.log("in web3login in phone ....(*******")
  // 8e5879b2c1feba071144472125c9ff8f

  // const provider = new ethers.providers.Web3Provider(walletConnectprovider)
  //  Enable session (triggers QR Code modal)
  // await provider.enable();

  // // Create a connector
  // const connector = new WalletConnect({
  //   bridge: "https://bridge.walletconnect.org", // Required
  //   qrcodeModal: QRCodeModal,
  // });
  // // Check if connection is already established
  // if (!connector.connected) {
  //   // create new session
  //   connector.createSession(
  //     {chainId: 80001}
  //   );
  // }

  // // Subscribe to connection events
  // connector.on("connect", (error, payload) => {
  //   console.log("payload ", payload)
  //   if (error) {
  //     throw error;
  //   }

  //   // Get provided accounts and chainId
  //   const { accounts, chainId } = payload.params[0];
  // });


  const provider = await detectEthereumProvider()

  if (provider) {

    console.log('Ethereum successfully detected!')
    store.dispatch(ChangeLoggerMessage("Ethereum successfully detected!"))

    /// Legacy providers may only have ethereum.sendAsync
    // const chainId = await provider.request({
    //   method: 'eth_chainId'
    // })
  } else {
    // if the provider is not detected, detectEthereumProvider resolves to null
    console.error('Please install MetaMask!')
    store.dispatch(ChangeLoggerMessage("Please install MetaMask!"))
  }


  // if (window.ethereum) {
  //   console.log("window.eth found ")
  //   handleEthereum();
  // } else {
  //   console.log("window.eth  not found ")
  //   store.dispatch(ChangeLoggerMessage("window.eth  not found"))
  //   window.addEventListener('ethereum#initialized', handleEthereum, {
  //     once: true,
  //   });

  //   // If the event is not dispatched by the end of the timeout,
  //   // the user probably doesn't have MetaMask installed.
  //   setTimeout(handleEthereum, 3000); // 3 seconds
  // }



  // await window.ethereum.enable();
  // try {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   const network = await provider.getNetwork();
  //   store.dispatch(ChangeLoggerMessage("Something..1 " + provider))
  //   // if (SUPPORTED_NETWORKS.indexOf(network.name) === -1) {
  //   //   store.dispatch(ChangeLoggerMessage("Something.."))
  //   //   if (window.confirm(`Only ${SUPPORTED_NETWORK_LONG} networks are currently supported. Should we switch to Matic Network?`) == true) {
  //   //       const check = await window.ethereum.request({
  //   //         method: "wallet_addEthereumChain",
  //   //         params: [{
  //   //             chainId: "0x13881",
  //   //             rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  //   //             chainName: "Matic Testnet",
  //   //             nativeCurrency: {
  //   //                 name: "MATIC",
  //   //                 symbol: "MATIC",
  //   //                 decimals: 18
  //   //             },
  //   //             blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
  //   //         }]
  //   //       });
  //   //       console.log("check..", check)
          
  //   //     } else {
  //   //       store.dispatch(ChangeLoggerMessage("Please install MetaMask!"))
  //   //       // return;
  //   //     }
  //   // }
  // } catch (err) {
  //   console.log("errror ")
  //   store.dispatch(ChangeLoggerMessage("error.." +  err))
  // }
  
  // let accounts = await provider.send("eth_requestAccounts", []);
  // localStorage.setItem("connected_matic_network", "10")
  // console.log("-------accounts---- .",);
  // console.log(accounts[0]);
  // console.log("----------- .",);
  // if (!validation(accounts[0])) {
  //   store.dispatch(ChangeValidUserState(false))
  //   return;
  // }
  // store.dispatch(Login(accounts[0]));
  // store.dispatch(ChangeValidUserState(true))

  // let auth_token: string = await loginAndAuthenticateUser(accounts[0]);
  // store.dispatch(ChangeAuthTOken(auth_token)); 

  // let user_all_data: USER_DETAILS = await fetchUserDetails();
  // store.dispatch(ChangeUserData(user_all_data)); 

  // let result = await fetchNFTsFromDB(accounts[0]);
  // console.log(accounts[0]);
  // const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
  // store.dispatch(setTotalNFTData(result.message))
  // store.dispatch(setNFTDetails(dataOfNFTS))
  // store.dispatch(setNFTLoadedBool(true))
  // store.dispatch(Login(accounts[0]));
  // store.dispatch(SetConnectedWeb3(true));


  // const {balance, decimals} = await getwBTCBalance(accounts[0])
  // console.log("--------bal--- .", balance, decimals, (parseFloat(balance)/(10 ** parseInt(decimals))).toString());
  // store.dispatch(ChangewbtcBalance((parseFloat(balance)/(10 ** parseInt(decimals))).toString()));
  // console.log("----------- .",);
  // console.log(accounts[0]);
  // console.log("----------- .",);
  // store.dispatch(ChangeMaticBalance(ethers.utils.formatEther(await provider.getBalance(accounts[0]))));
}