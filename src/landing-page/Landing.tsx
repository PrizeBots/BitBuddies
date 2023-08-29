import Home from "./Home";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import Fighters from "./Fighters";
import phaserGame from "../PhaserGame";
import Bootstrap from "../game/scenes/Bootstrap";
import Game from "../game/scenes/Game";
import MintPage from "./MintUiDesign/MintUiManager";
import OldMintPage from "./MintPage";
import { useAppDispatch, useAppSelector } from "../hooks";
import store from "../stores";
import { ChangePath } from "../stores/UserWebsiteStore";
import { FightConfirmationBox } from "../game/Components/FightConfirmationBox";
import { Web2LoginPage } from "./Web2LoginPage";
import styled from "styled-components";
import { SetGameStarted, SetMintGameStarted } from "../stores/PlayerData";
import MintCardsPage from "./MintCardsPage/MintCardsPage";
import { SetGlobalRefCode } from "../stores/MintCardStateStore";
import { isNullOrUndefined } from "util";
import NewFighters from "./FightersNew";
// import MintPage3 from './MintPage3';

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  // background-color: #262626;
  // background-color: #111b28;
`;

const Backdrop2 = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const Landing = (props: any) => {
  const dispatch = useAppDispatch();
  const HistoryPath = useAppSelector((state) => state.userPathStore.path);
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  const location = useLocation();
  // console.log("in Landing ..", props, location);
  const game = phaserGame.scene.keys.game as Game;
  let View;
  console.log("current path 1", HistoryPath, location.pathname, HistoryPath === "minting-game" && location.pathname !== "/mint");

  if (
    HistoryPath === "gamePlay" &&
    (
      location.pathname === "/home" ||
      location.pathname === "/" ||
      location.pathname === "/mint" ||
      location.pathname === "/leaderboard" ||
      location.pathname === "/presale"
    )
  ) {
    if (window.confirm("Are you sure?") == true) {
      if (bootstrap) {
        bootstrap.pauseGame();
        if (game.lobbySocketConnection) game.closeLobbySocketConnection();
        bootstrap.launchBackGroundNight();
        if (location.pathname === "/home" || location.pathname === "/") {
          View = <Home />;
        } else if (location.pathname === "/mint") {
          console.log(location.pathname);
          View = <MintPage />;
        }
      }
      store.dispatch(ChangePath(location.pathname));
      store.dispatch(SetGameStarted(false));
    } else {
      console.log("no no no..");
      // var bodyHtml = document.querySelector('body');
      // console.log("bodyhtml ", bodyHtml);
      store.dispatch(ChangePath("gamePlay"));
      store.dispatch(SetGameStarted(true));
    }
  }
  else if (
    HistoryPath === "minting-game" && location.pathname !== "/mint"
  ) {
    bootstrap.pauseMintingGame()
    store.dispatch(ChangePath(location.pathname));
    store.dispatch(SetMintGameStarted(false));
  }
  // else if (HistoryPath === "gamePlay"  && location.pathname === "/game") {
  //   View = <GameView />
  // }
  else {
    if (location.pathname === "/home" || location.pathname === "/") {
      View = <Home />;
      dispatch(SetGameStarted(false));
    } 
    // else if (location.pathname === "/mint") {
    //   console.log("debug.. -", location.pathname);
    //   View = <OldMintPage />;
    //   dispatch(SetGameStarted(false));
    // } else if (location.pathname === "/presale") {
    //   console.log("debug.. -", location.pathname);
    //   View = <MintPage />;
    //   dispatch(SetGameStarted(false));
    // } 
    else if (location.pathname.includes("/login")) {
      // console.log("debug.. -", location.pathname);
      View = <Web2LoginPage />;
      dispatch(SetGameStarted(false));
    } else if (location.pathname.includes("/game")) {
      // console.log("debug.. -", location.pathname);
      // View = <Fighters />;
      View = <NewFighters />
      // dispatch(setGameStarted(false));
    } else if (location.pathname.includes("/mint")) {

      const allMetaElements = document.getElementsByTagName('meta')
      console.log("meta -- ", allMetaElements)
      for (let i=0; i<allMetaElements.length; i++) { 
        console.log("---meta", allMetaElements[i].getAttribute("name"))
        if (allMetaElements[i].getAttribute("name") === "description") { 
          //make necessary changes
          console.log("meta 1 -- ", allMetaElements[i])
          // Use my ref code to join my gang and dominate the cities with me!
          // store.dispatch(SetMetaTagDescription())
          allMetaElements[i].setAttribute('description', "Use my ref code to join my gang and dominate the cities with me!"); 
          allMetaElements[i].setAttribute('title', "Bit Fighters"); 
          allMetaElements[i].setAttribute('og:description', "Use my ref code to join my gang and dominate the cities with me!"); 
          allMetaElements[i].setAttribute('og:title', "Bit Fighters"); 
          break;
        } 
      } 
      const url = new URL(window.location.href);
      const global_ref_code = url.searchParams.get("ref_code");
      console.log("debug.. -", location.pathname, window.location.href, "ref -",  global_ref_code);
      if (global_ref_code) {
        store.dispatch(SetGlobalRefCode(global_ref_code))
      }
      
      View = <MintCardsPage />;
    } else {
      View = (
        <div>
          <h1>404 Page does not exist</h1>
        </div>
      );
      dispatch(SetGameStarted(false));
    }
    //  else if (location.pathname === "/game"){
    //   View = <GameView />
    // }
  }

  console.log("current path 2 path___", HistoryPath, location.pathname);

  return (
    <div className="main-landing">
      {HistoryPath === "gamePlay" ? (
        <Backdrop2>
          <Header />
          <FightConfirmationBox />
          {View}
        </Backdrop2>
      ) : (
        <Backdrop>
          <Header />
          <FightConfirmationBox />
          {View}
          {/* <BottomTextView /> */}
        </Backdrop>
      )}
      {/* <Backdrop>
          <Header />
          <FightConfirmationBox />
          {View}
        </Backdrop> */}
    </div>
  );
};
export default Landing;
