import React, { useEffect } from "react";
import "./App.css";
import styled from "styled-components";
import Landing from "./landing-page/Landing";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import { InvalidUserPage } from "./landing-page/InvalidUserPage";
// import { ChangeMetaMaskInstalled } from './stores/UserWebsiteStore';
import store from "./stores";
import { Web3Login } from "./landing-page/Web3Login";

import axios from "axios";
import { ChangeGeoInfo } from "./stores/UserGeoStore";
import { ChangeMetaMaskInstalled } from "./stores/UserWebsiteStore";
import { LoopAllFightsAndUpdate, updateBetInfOfPlayer } from "./utils/fight_utils";
// import { LoopAllFightsAndUpdate } from './utils/fight_utils';
// import { FetchFightInfo } from './hooks/ApiCaller';
import DocumentMeta from 'react-document-meta';
import { ListGameServers } from "./utils/game_server_utils";
import { FetchLeaderBoard, fetchPlayerWalletInfo } from "./hooks/ApiCaller";
import Leaderboard from "./landing-page/Leaderboard";
import FightersNewCenterPart from "./landing-page/FightersNewCenterPart";
import { getBalances } from "./utils/web3_utils";

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

declare global {
  interface Window {
    ethereum?: any;
  }
}

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

// const SUPPORTED_NETWORKS = ["matic", "maticmum"];
// const SUPPORTED_NETWORK_LONG =
//   "Matic Mainnet, Matic Mumbai";

function App() {
  const loading = () => (
    <div className="animated fadeIn pt-3 text-center">Loading...</div>
  );
  const ValidUser = useAppSelector((state) => state.userPathStore.ValidUser);
  const dispatch = useAppDispatch();
  const gameServerReginoSelected = useAppSelector((state) => state.websiteStateStore.region)
  const gameStarted = useAppSelector((state) => state.playerDataStore.gameStarted)

  const meta = {
      title: 'Some Meta Title',
      description: 'I am a description, and I can create multiple tags',
      canonical: 'http://example.com/path/to/page',
      meta: {
        charset: 'utf-8',
        name: {
          keywords: 'react,meta,document,html,tags'
        }
      }
    };

  const getGeoInfo = () => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        const data = response.data;
        console.log("country info ", data);
        store.dispatch(
          ChangeGeoInfo({
            continent_code: data.continent_code,
            country_name: data.country_name,
            country_code: data.country_code,
            city: data.city,
          })
        );
        // console.log(" country . ", store.getState().geoStore.geoInfo)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let counter = 0;
  let fetchWalletCounter = 0;
  const LoopApiCaller = () => {
    setTimeout(() => {
      // FetchFightInfo(store.getState().fightInfoStore.current_fight_id)
      // TODO: call update for all of the fight ids in queuue
      
      // console.log("debug_game_state ", gameStarted, counter)
      if (counter >10) {
        // if (!gameStarted) {
        //   if (localStorage.getItem("game_state")=== "start") {
        //     ListGameServers(gameServerReginoSelected, "no_create")
        //   }
        // }
        LoopAllFightsAndUpdate();
        // updateBetInfOfPlayer();
        counter = -1;
      }
      counter = counter + 1;
      if (fetchWalletCounter > 20) {
        getBalances(store.getState().web3store.userAddress)
        // fetchPlayerWalletInfo(false, "app.tsx");
        fetchWalletCounter = -1;
      }
      fetchWalletCounter = fetchWalletCounter + 1;

      LoopApiCaller();
    }, 1000);
  };

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    console.log("canvas -- ", canvas)
    if (canvas)
      canvas.style.zIndex = "100000"
      // canvas?.onmousemove
    
    console.log("metamask installed --> ", isMetaMaskInstalled());
    dispatch(ChangeMetaMaskInstalled(isMetaMaskInstalled()));

    if (localStorage.getItem("connected_matic_network")) {
      console.log("connected matic network..");
      Web3Login();
    }

    // getGeoInfo();
    LoopApiCaller();
    // FetchLeaderBoard();

    // else if (!isNullOrUndefined(localStorage.getItem("web2_email_address")) && localStorage.getItem("web2_email_address") !== "" ) {
    //   console.log("web2 email exist login...")
    //   const web2Address = localStorage.getItem("web2_email_address")
    //   if (web2Address) Web2Login(web2Address)
    // } else if (localStorage.getItem("web2_wallet_address")) {
    //   console.log("web2 user login...")
    //   const web2Address = localStorage.getItem("web2_wallet_address")
    //   if (web2Address) Web2Login(web2Address)
    // }
  });

  return (
    <div className="App prevent-select">
      {/* <DocumentMeta {...{
      title: 'Bit Fighters',
      description: 'I am a description, and I can create multiple tags',
      meta: {
        charset: 'utf-8',
        name: {
          keywords: 'react,meta,document,html,tags'
        }
      }
    }}> */}

      
      <Backdrop>
        <BrowserRouter>
          {/* <Leaderboard /> */}
          {/* <FightersNewCenterPart /> */}
          <React.Suspense fallback={loading()}>
            {ValidUser ? (
              <Routes>
                <Route path="/" element={<Landing name="" />} />
                <Route path="home" element={<Landing name="home" />} />
                {/* <Route path="roadmap" element={<Landing name="roadmap" />} /> */}
                <Route path="game" element={<Landing name="game" />} />
                <Route path="mint" element={<Landing name="mint" />} />
                <Route path="leaderboard" element={<Landing name="leaderboard" />} />
                <Route path="login" element={<Landing name="login" />} />
                {/* <Route path="presale" element={<Landing name="presale" />} /> */}
                {/* <Route
                  path="mint-cards"
                  element={<Landing name="mint-cards" />}
                /> */}
              </Routes>
            ) : (
              <InvalidUserPage />
            )}
          </React.Suspense>
        </BrowserRouter>
      </Backdrop>
      {/* </DocumentMeta> */}
    </div>
  );
}

export default App;
