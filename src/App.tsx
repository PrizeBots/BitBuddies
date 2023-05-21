import React, { useEffect } from 'react';
import './App.css';
import styled from 'styled-components'
import Landing from './landing-page/Landing';
import {  Route, BrowserRouter, Routes } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks';
import { InvalidUserPage } from './landing-page/InvalidUserPage';
// import { ChangeMetaMaskInstalled } from './stores/UserWebsiteStore';
import store from './stores';
import { Web3Login } from './landing-page/Web3Login';

import axios from 'axios'
import { ChangeGeoInfo } from './stores/UserGeoStore';
import { ChangeMetaMaskInstalled } from './stores/UserWebsiteStore';
import { LoopAllFightsAndUpdate } from './utils/fight_utils';
// import { LoopAllFightsAndUpdate } from './utils/fight_utils';
// import { FetchFightInfo } from './hooks/ApiCaller';


const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

declare global {
  interface Window{
    ethereum?:any
  }
}

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}


// const SUPPORTED_NETWORKS = ["matic", "maticmum"];
// const SUPPORTED_NETWORK_LONG =
//   "Matic Mainnet, Matic Mumbai";

function App() {
  const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
  const ValidUser = useAppSelector((state) => state.userPathStore.ValidUser)
  const dispatch = useAppDispatch()

  const getGeoInfo = () => {
    axios.get('https://ipapi.co/json/').then((response) => {
        const data = response.data;
        console.log("country info ", data)
        store.dispatch(ChangeGeoInfo({
          continent_code: data.continent_code,
          country_name: data.country_name,
          country_code: data.country_code,
          city: data.city,
        }))
        // console.log(" country . ", store.getState().geoStore.geoInfo)
    }).catch((error) => {
        console.log(error);
    });
  };

  const LoopApiCaller = () => {
    setTimeout(() => {
      // FetchFightInfo(store.getState().fightInfoStore.current_fight_id)
      // TODO: call update for all of the fight ids in queuue
      LoopAllFightsAndUpdate()
      LoopApiCaller()
    }, 15000)
  };

  useEffect(() => {
    console.log("metamask installed --> ", isMetaMaskInstalled())
    dispatch(ChangeMetaMaskInstalled(isMetaMaskInstalled()))
    
    if (localStorage.getItem("connected_matic_network")) {
      console.log("connected matic network..")
      Web3Login() 
    } 

    getGeoInfo()
    LoopApiCaller()

    // else if (!isNullOrUndefined(localStorage.getItem("web2_email_address")) && localStorage.getItem("web2_email_address") !== "" ) {
    //   console.log("web2 email exist login...")
    //   const web2Address = localStorage.getItem("web2_email_address")
    //   if (web2Address) Web2Login(web2Address)
    // } else if (localStorage.getItem("web2_wallet_address")) {
    //   console.log("web2 user login...")
    //   const web2Address = localStorage.getItem("web2_wallet_address")
    //   if (web2Address) Web2Login(web2Address)
    // }

    

  })

  return (
    <div className="App prevent-select">
      <Backdrop>
        <BrowserRouter>
          <React.Suspense fallback={loading()}>
            {ValidUser? <Routes>
              <Route path="/" element={<Landing name="" />} />
              <Route path="home" element={<Landing name="home" />} />
              <Route path="roadmap" element={<Landing name="roadmap" />} />
              <Route path="game" element={<Landing name="game" />} />
              <Route path="mint" element={<Landing name="mint" />} />
              <Route path="login" element={<Landing name="login" />} />
              <Route path="presale" element={<Landing name="presale" />} />
            </Routes> : <InvalidUserPage />
          }
          </React.Suspense>
        </BrowserRouter>
      </Backdrop>
    </div>
  );
}

export default App;
