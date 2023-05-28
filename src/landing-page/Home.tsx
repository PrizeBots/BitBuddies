import React, { useState } from 'react';
import styled from 'styled-components'
import Button from '@mui/material/Button'
import {  useAppDispatch, useAppSelector } from '../hooks';
import { Alert, AlertTitle, LinearProgress, makeStyles, Snackbar, Tooltip, withStyles } from '@mui/material';
import { Link } from 'react-router-dom';

import MetaMaskOnboarding from '@metamask/onboarding';
import { Web3Login } from './Web3Login';
import { Login, SetConnectedWeb3 } from '../stores/Web3Store';
import { makeid, randomNickNameGenarate } from '../utils';
import { fetchNFTsFromDB, loginAndAuthenticateUser, randomGenarate } from '../hooks/ApiCaller';
import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT';
import { setNFTDetails, setNFTLoadedBool, setTotalNFTData } from '../stores/BitFighters';
import { isNullOrUndefined } from 'util';
import { ChangeAuthTOken, ChangeMaticBalance, ChangeValidUserState, ChangewbtcBalance } from '../stores/UserWebsiteStore';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 120px;
  }
`

const Headline = styled.div`
  h2 {
    font-family:'Cooper Black', sans-serif;
    // font-family: Monospace;
    font-style: bold;
    font-size: 32px;
    line-height: 75%;
    font-weight: 400;
    color: grey;
  }

`

const ButtonView = styled(Button)`
  span {
    color: black;
    // font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    font-family:'Cooper Black', sans-serif;
  }

  // background-color: #e60808;
  background-color: #9c341a;

  &:hover {
    background-color: #852d17;
  }


  width: 300px;
  height: 60px;
`;

const ButtonnAndInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  // background-color: yellow;
`

const InfoButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  // background-color: red;
  align-items: center;
  padding-left: 10px;
`

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;

  h3 {
    color: #33ac96;
  }
`

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

const vertical= 'top';
const horizontal = 'center';

declare global {
  interface Window{
    ethereum?:any
  }
}


function Home() {
  const [snackBarOpen , setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("BitFighter Minted");
  const bitFighterNFTData = useAppSelector((state) => state.bitFighters.nftData);
  const nftDataLoaded = useAppSelector((state) => state.bitFighters.loaded);
  const userAddress = useAppSelector((state) => state.web3store.userAddress);
  const web3ConnectedUser = useAppSelector((state) => state.web3store.web3Connected);
  const metaMaskInstalledBool = useAppSelector((state) => state.userPathStore.metaMaskInstalled)
  const dispatch = useAppDispatch()
  const [mintingBool, setMintingBool] = useState(false)
  const onboarding = new MetaMaskOnboarding();
  // console.log("in home .. ", bitFighterNFTData.length, nftDataLoaded);

  const handleClose = () => {
    setSnackBarOpen(false);
  };

  const connectButtonHandle = async() => {
    // if (getSystemInfo()) {
    //   // await PhoneWeb3Login()
    //   await Web3Login()
    // } else {
    if (!metaMaskInstalledBool) {
      onboarding.startOnboarding()
    } 
    else if (metaMaskInstalledBool) {
      await Web3Login()
      // await PhoneWeb3Login()
    }
    // }
  }

  const joinAsGuest = async() => {
    console.log(" ..join as guest clicked.. ")
    const web2Id = makeid(50);
    dispatch(Login(web2Id));
    dispatch(ChangeValidUserState(true));
    const auth_token: string = await loginAndAuthenticateUser(web2Id);
    dispatch(ChangeAuthTOken(auth_token)); 
    localStorage.setItem("web2_wallet_address", web2Id);
    setTimeout(async() => {
      const output = await randomGenarate(web2Id, "", 20, randomNickNameGenarate(), 'web2');
      console.log("--output .. ", output);
      if (!isNullOrUndefined(output)) {
        const result = await fetchNFTsFromDB(web2Id);
        const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
        dispatch(setTotalNFTData(result.message))
        dispatch(setNFTDetails(dataOfNFTS))
        dispatch(setNFTLoadedBool(true))
        dispatch(Login(web2Id));
        dispatch(SetConnectedWeb3(false));

        dispatch(ChangewbtcBalance("0"));
        dispatch(ChangeMaticBalance("0"));
        setMintingBool(false);
      }
    }, 1000)
  }

  const joinWithEmailAddress = async() => {
    console.log(" ..join with email address clicked.. ")
    const web2Id = localStorage.getItem("web2_email_address");
    setTimeout(async() => {
      if (web2Id) {
        const output = await randomGenarate(web2Id, "", 20, randomNickNameGenarate(), 'web2');
        console.log("--output .. ", output);
        if (!isNullOrUndefined(output)) {
          const result = await fetchNFTsFromDB(web2Id);
          const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
          dispatch(setTotalNFTData(result.message))
          dispatch(setNFTDetails(dataOfNFTS))
          dispatch(setNFTLoadedBool(true))
          dispatch(Login(web2Id));
          dispatch(SetConnectedWeb3(false));

          dispatch(ChangewbtcBalance("0"));
          dispatch(ChangeMaticBalance("0"));
        }
      }
    }, 1000)
  } 

  let View = null ; 
  if (!nftDataLoaded) {
    View = <>
   
    <ButtonnAndInfoWrapper>
      <Tooltip title="Connect web3 wallet">
      <ButtonView variant="contained" color="error" onClick={() => connectButtonHandle() }>
        <span>
          Connect
        </span>
      </ButtonView>
      </Tooltip>
      <Tooltip title="Go to Docs">
      <InfoButtonWrapper>
        <a href="https://docs.bitfighters.club/bit-fighters/the-game/get-started/connect-a-wallet" target="_blank">
        <InfoOutlined color='action' fontSize='medium' />
        </a>
      </InfoButtonWrapper>
      </Tooltip>
    </ButtonnAndInfoWrapper>
    </>
  } else if (nftDataLoaded && !web3ConnectedUser && bitFighterNFTData.length > 0) {
    View = 
    <>
        <Link 
            className="primary" 
            to="/game" 
          >
          <ButtonView 
            variant="contained" 
            color="info"
            // onClick={() => joinAsGuest()}
            >
              <span>Play Now</span>
          </ButtonView>
        </Link>

        <ButtonView 
          variant="contained" color="info" onClick={() => connectButtonHandle() }>
          <span>
            Connect Web3 Wallet
          </span>
        </ButtonView>
      </>
      
  } else if (nftDataLoaded && !web3ConnectedUser && bitFighterNFTData.length === 0) {
    View = 
    <>
        <ButtonView 
          variant="contained" 
          color="info"
          onClick={() => joinWithEmailAddress()}
          >
            <span>Play Now</span>
        </ButtonView>

        <ButtonView 
          variant="contained" color="info" onClick={() => connectButtonHandle() }>
          <span>
            Connect Web3 Wallet
          </span>
        </ButtonView>
      </>
      
  } else if (nftDataLoaded && bitFighterNFTData.length === 0) {
    View = <Link 
        className="primary" 
        to="/mint" 
      >
        <ButtonView 
          variant="contained" 
          color="inherit"
          >
            <span>Mint</span>
        </ButtonView>
      </Link>
  } else if (nftDataLoaded && bitFighterNFTData.length > 0) {
     View = <>
      <Link 
        className="primary" 
        to="/mint" 
      >
        <ButtonView 
          variant="contained" 
          color="error"
          >
            <span>Mint</span>
        </ButtonView>
      </Link>

      <Link 
        className="primary" 
        to="/game" 
      >
        <ButtonView 
          variant="contained" 
          color="error"
          >
            <span>View Fighters</span>
        </ButtonView>
      </Link>
     </>
  }

  return(
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          <AlertTitle>Success</AlertTitle>
            {snackBarMessage} <strong>check it out! </strong>
        </Alert>
      </Snackbar>
      <Content>
        <picture style={{padding:'50px'}}>
          <source media="(min-width:750px)" srcSet="/bitfgihter_assets/websiteLogo.png" />
          <source media="(min-width:100px)" srcSet="/bitfgihter_assets/logo_small.png" />
          <img src="img_orange_flowers.jpg" alt="Flowers" style={{width:"auto", height: `40vh`}} />
        </picture>
        {View}
      </Content>
      {/* <Headline>
        <h2>
          Bitfighter Pre-Sale Mint
        </h2>
        <h2>
          Begins 5/6/2023
        </h2>
        <h2>
          Only 100 will be available
        </h2>
      </Headline> */}
    </div>
  )
}
export default Home;