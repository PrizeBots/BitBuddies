import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Box, Button, CircularProgress, FormControl, Grid, ImageList, ImageListItem, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Snackbar, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel'
import phaserGame from '../PhaserGame'
import Bootstrap from '../game/scenes/Bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import Chat from '../game/Components/Chat';
import CancelIcon from '@mui/icons-material/Cancel';
import Utils from './Utils';
import { v4 as uuidv4 } from 'uuid';
import { SetCurrentGamePlayer, setNickName } from '../stores/PlayerData';
import { IPlayerData } from '../game/characters/IPlayer';
import { PlayersInfo } from '../game/Components/PlayersInfo';
import { SendingFriendRequest } from '../game/Components/SendingFriendRequest';
import { QueueAddInfoWindow } from '../game/Components/QueueAddInfoWindow';
// import { BroadCastingMessage } from '../game/Components/BroadcastingInfo/BroadCastingMessageCenter';
import { BroadcastingAnnouncement } from '../game/Components/BroadcastingInfo/BroadcastingAnnouncement';
import { BroadCastCombiner2 } from '../game/Components/BroadCastInfo2/BroadcastCombiner';
import { RegisterNow } from '../game/Components/RegisterNow';
import { RegisterNewUserInGame } from '../game/Components/RegisterNewUserInGame';
import { ControlsInfo } from '../game/Components/ControlsInfo';
import { isNullOrUndefined } from 'util';
import { getSystemInfo } from '../utils/systemInfo';
// import { CoinsView } from '../game/Components/CoinsView';
import { ATMView } from '../game/Components/ATMView';
import NewMenuSideBar from '../game/Components/NewMenuSideBar';
import { InventoryView } from '../game/Components/InventoryView/InventoryView';
import InGameAssetPurchase from '../game/Components/MenuComponents/InGameAsssetPurchase';
import { CheckIfAcceptableNickName, fetchNFTsFromDB, loginAndAuthenticatePlayer, updateNFTsInDB, updateSingleBfInDB } from '../hooks/ApiCaller';
import store from '../stores';
import { setPlayerAuthToken } from '../stores/AuthStore';
import NotificationMessageHelper from '../game/Components/NotificationMessageHelper';
import { EquipView } from '../game/Components/InventoryView/EquipView';
import WinnersReceipt from '../game/Components/MenuComponents/WinnersReceipt';
import { Loader } from './components/Loader/Loader';
import { SetGameLoadingState, SetSelectedGameServerURL, SetShowGameServersList } from '../stores/WebsiteStateStore';
import { ListGameServers } from '../utils/game_server_utils';
import { ServerListWindow } from '../game/Components/MenuComponents/ServerList/ServerListWindow';
import REACT_APP_LOBBY_WEBSOCKET_SERVER from '../game/configs';
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../stores/NotificationStore';
import { registerBitfighter } from '../contract';
import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT';
import { setTotalNFTData, setNFTDetails } from '../stores/BitFighters';
import Footer from './Footer';
import NewWinnersReceipt from '../game/Components/MenuComponents/NewWinnersReceipt';
import FightersNewCenterPart from './FightersNewCenterPart';
// import TextView from '../game/Components/TextView';
// import { MyInfoIcon } from '../game/Components/InfoIcon';


const Backdrop = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`

const Wrapper = styled.div`
  background: #D8DFE5;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`

const Title = styled.h1`
  font-size: 28px;
  // color: #eee;
  color: #d2d2d2;
  text-align: center;
  margin: 50px;
  // margin-top: 20px;

  font-family:'Cooper Black', sans-serif;
`

const Content = styled.div`
  position: relative;
  // background-color:#2d2a2a;
  left: 50%;
  top: 50%;

  display: flex;
  flex-direction: column;
  // gap: 20px;
  // margin: 50px 0;
  align-items: center;
  justify-content: center;

  transform: translate(-50%, -50%);
`

const ImageWraper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  opacity: 0.8;
  padding: 20px 20px 20px;
  width: 300px;
  align-items: center;
  justify-content: center;
`

const HeadingText = styled.h1`
  font-size: 2rem;
  letter-spacing: 1px;
  font-family:'Cooper Black', sans-serif;
  // font-family: Montserrat, sans-serif;
  font-weight: 400;
  text-transform: none;
  margin: 0px auto 0;
  color: aliceblue;
`

const ButtonView = styled(Button)`
  span {
    color: #a7a5a5;;
    font-style: bold;
    font-size: 20px;
    font-family:'Cooper Black', sans-serif;
  }

  background-color: #9c341a;

  &:hover {
    background-color: #852d17;
  }

  width: 300px;
  height: 60px;
`;


const FixedForm = styled.div`
  position: absolute;
  margin: 50%;
  transform: translate(-50%, -50%);

  background: #d2d3e1;
  width: 400px;
  height: 30vh;

  opacity: 0.9;

  border-radius: 20px;



  label {
    font-size: 20px;
    font-family:'Cooper Black', sans-serif;
    letter-spacing: 0.5px;
    margin-left: 5px;
  }

  // h2 {
  //   font-family:'Cooper Black', sans-serif;
  //   font-style: bold;
  //   font-size: 30px;
  //   color: black;
  //   line-height: 75%;
  //   margin: 10px;
  // }

  input[type="text"] {
    padding: 0;
    padding-left: 3px;
    background-color: transparent;
    outline: 0;
    border: 0;
    border-bottom: 3px solid #363636;
    max-width: 200px;
    text-align: center;
    font-family: "Cooper Black";
    font-size: 16px;
    color: #363636;;
  }

  input[type="number"] {
    padding: 0;
    padding-left: 3px;
    background-color: transparent;
    outline: 0;
    border: 0;
    border-bottom: 3px solid #363636;
    max-width: 40px;
    text-align: center;
    font-family: "Cooper Black";
    font-size: 16px;
    color: #363636;;
  }
`


const BoxWrapper2 = styled(Box)`
  overflow-y: scroll;
  width: 33vw;
  position: relative;

  img {
    margin-top: 50px;
  }

  h2 {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 30px;
    color: black;
    line-height: 75%;
    margin: 10px;
    margin-top: 25px;
  }
`;


const BoxWrapper = styled(Box)`
  overflow-y: scroll;
  position: relative;
  background-color:#2d2a2a;
  // background-color: #111b28;
  
  height: 80vh;
  max-width: 36vw;
  margin-left: 10px;
  color: white;

  border-right: 10px solid #626d7c;
  border-left: 10px solid #626d7c;
  border-bottom: 10px solid #626d7c;

  img {
    height: 132px;
    width: 132px;
  }
`;

const BoxImageList = styled(ImageList)`
  background-color:#2d2a2a;
  border-right: 10px solid #626d7c;
  border-left: 10px solid #626d7c;
  border-bottom: 10px solid #626d7c;
`;

const ImageView = styled.div`
  h1 {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 30px;
    color: aliceblue;
    line-height: 75%;
    // margin: 10px;
    // margin-top: 25px;
  }

  img {
    margin-top: 10px;
  }
`

const ListImageView = styled.div`
  h1 {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 16px;
    color: aliceblue;
    line-height: 75%;
    margin: 10px;
  }
`

const AttributeInfo = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: space-around;
  align-items: center;

  // background-color: red;
  // margin: -5px;
  gap: 0px;
  line-height: 50%;


  img {
    justify-content: flex-start;
    align-items: center;
    height: 20px;
    width: 20px;
  }

  h5 {
    color: black;
    font-style: bold;
    font-size: 12px;
    font-family:'Cooper Black', sans-serif;
  }
`


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} placement="top" arrow />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    // width: 150,
    // height: 200,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
  [`& .${tooltipClasses.arrow}`]: {
    "&:before": {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      height: '10px',
      // width: '5px',
    },
  }
}));

  // background: #A1A7B8;


function NewFighters() {
  const bitFighterNFTData = useAppSelector((state) => state.bitFighters.nftData)
  const bitFightersTotalData = useAppSelector((state) => state.bitFighters.totalNFTData)
  const bitfightersLoadedBool = useAppSelector((state) => state.bitFighters.loaded)
  const loggedInUserWalletAddress = useAppSelector((state) => state.web3store.userAddress)
  const userAddress = useAppSelector((state) => state.web3store.userAddress);
  
  const gameServerReginoSelected = useAppSelector((state) => state.websiteStateStore.region)
  // console.log("--------total_data-------", bitFightersTotalData)
  // console.log("--------total_data2-------", bitFighterNFTData)

  const selectedPlayer = useAppSelector(
    (state) => state.playerDataStore.current_game_player_info
  );


  // const tempAllData = JSON.parse(JSON.stringify(bitFightersTotalData))
  // console.log("--------total_data_temp2-------", tempAllData)
  // if (bitFightersTotalData.length > 0) {
  //   for (let i =0; i < 50; i++) {
  //     const temp = tempAllData[0];
  //     temp.data.first_frame_image = "https://images.unsplash.com/photo-1589118949245-7d38baf380d6"
  //     temp.dummy = true;

  //     tempAllData.push(temp)
  //   }
  // }

  // console.log("--------total_data_temp-------", tempAllData)
  

  const dummyBfsData: any[] = []
  const attributesHTML: Array<any> = []
  // for (let i =0 ; i < 100; i ++) {
  //   for (let j = 0; j < 5; j++) {
  //     dummyBfsData.push(bitFightersTotalData[j])
  //   }
  // }

  const ProfilemenuClicked = useAppSelector((state) => state.userPathStore.ShowMenuBox)

  const gameStarted = useAppSelector((state) => state.playerDataStore.gameStarted)

  // console.log("current path 333 ", gameStarted)

  const [formNickNameame, setFormNickName] = useState("")
  const [formLuckyNumber, setFormLuckyNumber] = useState(1)

  // const [game_server, set_game_server ]= useState("Washington_DC")

  const [registerProcessRunning, setRegisterProcessRunning] = useState(false)

  const [playerSelectedBool, setPlayerSelectedBool] = useState(false);
  const [snackBarOpen , setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [playerSelected, setPlayerSelected] = useState<IPlayerData>();
  // const [gameStarted, setGameStarted] = useState(false);
  const [cardSelected, setCardSelected] = useState("")
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  // let noBitFighter = false;
  // let boxWidth = 500;
  // let carouselUI = null;
  // let NewUI = null;
  // let totalUI: JSX.Element = <></>;
  // const [totalUI, setTotalUI] = useState<JSX.Element>(<></>);
  // let totalUI = null;
  // let animationView = <>Animation View</>;
  // let animationUI = null;
  // const dispatch = useAppDispatch();

  // const handleClose = () => {
  //   setSnackBarOpen(false);
  // };

  // const [openModal, setOpenModal] = useState(false);
  // const handleModalClose = () => {
  //   setOpenModal(false);
  // };
  
  const handlePlayerSelection = async (data:IPlayerData) => {
    console.log("--player selected.. data ", data)
    setPlayerSelected(data);
    setPlayerSelectedBool(true);

    store.dispatch(SetShowGameServersList(true));
    store.dispatch(SetCurrentGamePlayer(data));
    store.dispatch(setNickName(data.nick_name))


    setCardSelected(data.data.image)
    bootstrap.play_select_sound()

    console.log("--player selected.. calling login ")
    const playerAuthToken = await loginAndAuthenticatePlayer(data.user_wallet_address, data.minted_id);
    if (!isNullOrUndefined(playerAuthToken)) {
      store.dispatch(setPlayerAuthToken(playerAuthToken))
      ListGameServers(gameServerReginoSelected)
    }

    
    // console.log("game start -> ", playerSelected)
  }

  // const startGame = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   event.preventDefault();
    
  //   // if (bodyHtml) {
  //   //   bodyHtml.style.zoom = "80%";
  //   //   // bodyHtml.style.webkitTransform = "rotate(90deg)";
  //   // }
  //   // navigate("/game", { replace: true });
  //   const playerAuthToken = await loginAndAuthenticatePlayer(playerSelected!.user_wallet_address, playerSelected!.minted_id);
  //   if (!isNullOrUndefined(playerAuthToken)) {
  //     store.dispatch(setPlayerAuthToken(playerAuthToken))
  //     dispatch(SetGameStarted(true));

  //     store.dispatch(SetSelectedGameServerURL(REACT_APP_LOBBY_WEBSOCKET_SERVER));
      
  //     // dispatch(SetCurrentGamePlayer(playerSelected))

  //     // dispatch(setNickName(playerSelected!.nick_name))
  //     // const bodyHtml = document.querySelector('html');
  //     // console.log("bodyhtml ", bodyHtml);
  //     store.dispatch(SetGameLoadingState(true))
  //     bootstrap.launchGame(playerSelected)
  //   }
    
  // }

  const registerFormValidate = async () => {
    setRegisterProcessRunning(true)

    console.log("in ---- register fn... ", formLuckyNumber, formNickNameame, playerSelected?.minted_id)

    if (!(formLuckyNumber > 0 && formLuckyNumber < 100)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Lucky Number should be 0-100"))
      setRegisterProcessRunning(false)
      return
    }

    if (!(formNickNameame.length > 0 && formNickNameame.length < 13)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Nick name should be of length 1-12"))
      setRegisterProcessRunning(false)
      return
    }

    if (playerSelected && playerSelected?.minted_id === 0) {
      return
    }

    if (!playerSelected) {
      return
    }

    // check if acceptable nick name
    const data = await CheckIfAcceptableNickName(formNickNameame);
    console.log("---debug_nick_name_validate---", data)
    if (!data) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Choose other Nick Name. This one is taken"))
      setRegisterProcessRunning(false)
      return
    }
    

    // update in smart contract. and then update the db
    // then fetch data from db
    // and udate the UI

    const registered = await registerBitfighter(formNickNameame, formLuckyNumber, playerSelected?.minted_id)
    if (registered.error === 1) {
      //
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage(registered.message + "\n" +  registered.error_data))

    } else {
      //
      await updateSingleBfInDB(store.getState().web3store.userAddress, playerSelected.minted_id);
      const result = await fetchNFTsFromDB(store.getState().web3store.userAddress);
      console.log("-------dataofnfts--*******-- .", result);

      const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
      console.log("dataofnfts -- ", dataOfNFTS )

      store.dispatch(setTotalNFTData(result.message))
      store.dispatch(setNFTDetails(dataOfNFTS))

      console.log("--dataofnfts-", playerSelected.minted_id)

      for (let i = 0; i < result.message.length; i++) {
        console.log("--dataofnfts-", playerSelected.minted_id, result.message[i].minted_id)
        if (playerSelected.minted_id === result.message[i].minted_id) {
          store.dispatch(SetCurrentGamePlayer(result.message[i]));
        }
      }
    }

    setRegisterProcessRunning(false)
    
  }

  useEffect(() => {
    if (bitFighterNFTData.length > 0) {
      // store.dispatch(SetShowGameServersList(true));
    }

    if (!gameStarted && userAddress !== "") {
      setTimeout(() => {
        store.dispatch(SetShowGameServersList(true));
      }, 1000)
      
    } else {
      store.dispatch(SetShowGameServersList(false));
    }


    // console.log("--------- in fightersnew -- ", selectedPlayer)

    // if (selectedPlayer)
    
    window.addEventListener('beforeunload', beforeUnloadFun)
    function beforeUnloadFun() {
      localStorage.setItem("last_logged_out", new Date().getTime().toString())
    }
    return() =>{
      // beforeUnloadFun()
      window.removeEventListener('beforeunload', beforeUnloadFun)
    }
  }, [])


  if (bitFighterNFTData.length == 0 && (loggedInUserWalletAddress !== "") && bitfightersLoadedBool) {
    // carouselUI = <Title>  :( No Bit Fighters detected in this wallet. </Title>
    // totalUI = <Title>  :( No Bit Fighters detected in this wallet. </Title>
    // boxWidth = 400;
    // noBitFighter = true;
  } else if (bitFighterNFTData.length == 0 && (loggedInUserWalletAddress !== "") && !bitfightersLoadedBool) {
    // carouselUI = <Title> Loading.. </Title>
    // boxWidth = 400;
    // noBitFighter = true;
  } else if (loggedInUserWalletAddress === "") {
    // carouselUI = <Title>  Checking for Bitfighters </Title>
    // boxWidth = 400;
    // noBitFighter = true;
  } else {
    // console.log("changing current path")
    // if (!gameStarted) {
    //   store.dispatch(SetShowGameServersList(true));
    // } else {
    //   store.dispatch(SetShowGameServersList(false));
    // }
  }

  // if (gameStarted) {
  //   totalUI = <>
  //     <NotificationMessageHelper />
  //     <>
  //       {ProfilemenuClicked && <NewMenuSideBar />}
  //     </>
      
  //     <InventoryView />
  //     <EquipView />
  //     <BroadCastCombiner2 />
  //     <ATMView />
  //     <InGameAssetPurchase />
  //     <BroadcastingAnnouncement />
  //     {/* <RegisterNow /> */}
  //     {/* <RegisterNewUserInGame /> */}
  //     <ControlsInfo />
  //     <Chat />
  //     <PlayersInfo />
  //     <QueueAddInfoWindow />
  //     {/* <WinnersReceipt /> */}
  //     <NewWinnersReceipt />
  //     <SendingFriendRequest />
  //     <Footer />
  //   </>
  // } else {
  //   totalUI = 
  //   <div style={{
  //     display: 'flex',
  //     flexDirection: 'row',
  //     marginTop: '5%'
  //   }}>
  //     {
  //       (bitFighterNFTData.length == 0 && (loggedInUserWalletAddress !== "") && bitfightersLoadedBool)?
  //       <Content>
  //           <Title>  :( No Bit Fighters detected in this wallet. </Title>
  //           <Link 
  //             className="primary" 
  //             to="/mint" 
  //           >
  //             <ButtonView variant="contained">
  //               <span>
  //                 Mint BitFighters
  //               </span>
  //             </ButtonView>
  //           </Link>
  //       </Content>
  //        :
  //       (bitFighterNFTData.length == 0 && (loggedInUserWalletAddress !== "") && !bitfightersLoadedBool)?
  //       <Content>
  //         <Title> Loading.. </Title>
  //       </Content>:
  //       (loggedInUserWalletAddress === "")?
  //       <Content>
  //         <Title> Checking for Bitfighters </Title>
  //       </Content>
  //         :
  //       <>
  //         {/* <BoxWrapper sx={{ flexGrow: 1 }} >


  //           <ImageList 
  //             cols={4} 
  //             gap={0}
  //             rowHeight={164}
  //           >
  //             {bitFightersTotalData.map((data) => (
  //               <ImageListItem key={uuidv4()} style={{
  //                 border: '2px solid #bababa'
  //               }}>
  //                 <HtmlTooltip title={
  //                   <React.Fragment>
  //                       {
  //                         data.data.attributes.map(((attr: {trait_type: any, value: any} )=> {
  //                           return(
  //                             attr.trait_type === "defense"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/diamond_icon.png" 
  //                                 alt="." />
  //                               <h5> Defense : {attr.value} </h5>
  //                             </AttributeInfo>
                              
  //                             :
  //                             attr.trait_type === "health"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/heart_icon.png" 
  //                                 alt="." />
  //                               <h5> Health : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "kick"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/kick_icon.png" 
  //                                 alt="." />
  //                               <h5> Kick : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "punch"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/punch_icon.png" 
  //                                 alt="." />
  //                               <h5> Punch : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "speed"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/flash_icon.png" 
  //                                 alt="." />
  //                               <h5> Speed : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "stamina"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/water_drop_icon.png" 
  //                                 alt="." />
  //                               <h5> Stamina : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                           <></>
  //                         )
                          
  //                         })) 
  //                       }
  //                   </React.Fragment>
  //                 }>
  //                   <ImageListItem key={uuidv4()}>
  //                     <img
  //                       src={`${data.data.first_frame_image}?w=164&h=164&fit=crop&auto=format`}
  //                       srcSet={`${data.data.first_frame_image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
  //                       // src={`${data.data.first_frame_image}`}
  //                       alt={"Hero"}
  //                       loading="lazy"
  //                       style={{
  //                         // margin: '20px',
  //                         // aspectRatio: `${15/16}`,
  //                         // backgroundColor: 'red'
  //                       }}
  //                       onClick={() => {
  //                         handlePlayerSelection(data)
  //                       }}
  //                     />
  //                   </ImageListItem>
  //                 </HtmlTooltip>
  //               </ImageListItem>
  //             ))}
  //           </ImageList>
  //         </BoxWrapper> */}

  //         {/* <ImageList 
  //             cols={5} 
  //             gap={0}
  //             sx={{
  //               width: `36vw`,
  //               height: `80vh`
  //             }}
  //           >
  //             {bitFightersTotalData.map((data: any) => (
  //               <ImageListItem key={uuidv4()} style={{
  //                 border: '2px solid #bababa'
  //               }}>
  //                 <HtmlTooltip title={
  //                   <React.Fragment>
  //                       {
  //                         data.data.attributes.map(((attr: {trait_type: any, value: any} )=> {
  //                           return(
  //                             attr.trait_type === "defense"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/diamond_icon.png" 
  //                                 alt="." />
  //                               <h5> Defense : {attr.value} </h5>
  //                             </AttributeInfo>
  //                             :
  //                             attr.trait_type === "health"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/heart_icon.png" 
  //                                 alt="." />
  //                               <h5> Health : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "kick"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/kick_icon.png" 
  //                                 alt="." />
  //                               <h5> Kick : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "punch"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/punch_icon.png" 
  //                                 alt="." />
  //                               <h5> Punch : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "speed"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/flash_icon.png" 
  //                                 alt="." />
  //                               <h5> Speed : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "stamina"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/water_drop_icon.png" 
  //                                 alt="." />
  //                               <h5> Stamina : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                           <></>
  //                         )
                          
  //                         })) 
  //                       }
  //                   </React.Fragment>
  //                 }>
  //                   <ListImageView>
  //                     <h1>
  //                       {data?.nick_name !== ""? data?.nick_name: "?"}
  //                     </h1>
  //                     <ImageListItem key={uuidv4()}>
  //                       <img
  //                         src={`${data.data.first_frame_image}?w=164&h=164&fit=crop&auto=format`}
  //                         srcSet={`${data.data.first_frame_image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
  //                         alt={"Hero"}
  //                         loading="lazy"
  //                         onClick={() => {
  //                           handlePlayerSelection(data)
  //                         }}
  //                       />
  //                     </ImageListItem>
  //                   </ListImageView>
  //                 </HtmlTooltip>
  //               </ImageListItem>
  //             ))}
  //         </ImageList> */}

  //         <BoxWrapper sx={{ flexGrow: 1}}>
  //           <Grid container spacing={0}>

  //             {bitFightersTotalData.map((data) => (
  //               <Grid key={uuidv4()} item xs={3} style={{
  //                 border: '2px solid #bababa'
  //               }}>
  //                 <HtmlTooltip title={
  //                   <React.Fragment>
  //                       {
  //                         data.data.attributes.map(((attr: {trait_type: any, value: any} )=> {
  //                           return(
  //                             attr.trait_type === "defense"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/diamond_icon.png" 
  //                                 alt="." />
  //                               <h5> Defense : {attr.value} </h5>
  //                             </AttributeInfo>
                              
  //                             :
  //                             attr.trait_type === "health"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/heart_icon.png" 
  //                                 alt="." />
  //                               <h5> Health : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "kick"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/kick_icon.png" 
  //                                 alt="." />
  //                               <h5> Kick : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "punch"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/punch_icon.png" 
  //                                 alt="." />
  //                               <h5> Punch : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "speed"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/flash_icon.png" 
  //                                 alt="." />
  //                               <h5> Speed : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                             attr.trait_type === "stamina"?
  //                             <AttributeInfo>
  //                               <img 
  //                                 src="bitfgihter_assets/icons/water_drop_icon.png" 
  //                                 alt="." />
  //                               <h5> Stamina : {attr.value} </h5>
  //                             </AttributeInfo>:
  //                           <></>
  //                         )
                          
  //                         })) 
  //                       }
  //                   </React.Fragment>
  //                 }>
  //                   <Grid key={uuidv4()}>
  //                     <ListImageView>
  //                     <h1>
  //                       {data?.nick_name !== ""? data?.nick_name: "?"}
  //                     </h1>

  //                     {/* <h1 style={{
  //                       position:'relative',
  //                       left: `-50px`,
  //                     }}>
  //                       {data.data.total_ap}
  //                     </h1> */}
  //                     <img
  //                       // src={`${data.data.first_frame_image}?w=164&h=164&fit=crop&auto=format`}
  //                       // srcSet={`${data.data.first_frame_image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
  //                       src={`${data.data.first_frame_image}`}
  //                       alt={"Hero"}
  //                       loading="lazy"
  //                       style={{
  //                         marginBottom: '20px',
  //                         // marginTop: '-10px'
  //                         // aspectRatio: `${15/16}`,
  //                         // backgroundColor: 'red'
  //                       }}
  //                       onClick={() => {
  //                         handlePlayerSelection(data)
  //                       }}
  //                     />
  //                     </ListImageView>
  //                   </Grid>
  //                 </HtmlTooltip>
  //               </Grid>
  //             ))}
  //           </Grid>
  //         </BoxWrapper>

  //         <BoxWrapper2>
  //           {
  //             (cardSelected !== "" && selectedPlayer.nick_name === "")?
  //               <FixedForm>
  //                 <h2>
  //                   Register your Fighter
  //                 </h2>

  //                 <label htmlFor="nick_name" style={{
  //                   marginTop: '20px'
  //                 }}> Name: </label>
  //                 <input
  //                   id="nick_name"
  //                   type="text"
  //                   placeholder='up to 12 letters'
  //                   value={formNickNameame}
  //                   onChange={(e) => {
  //                     setFormNickName(e.target.value);
  //                   }}
  //                   required
  //                 />
  //                 <br />

  //                 <label htmlFor="lucky_number" style={{
  //                   marginTop: '20px'
  //                 }}> Lucky #: </label>
  //                 <input
  //                   id="lucky_number"
  //                   type="text"
  //                   placeholder='(1-100)'
  //                   onChange={(e) => {
  //                     setFormLuckyNumber(parseInt(e.target.value));
  //                   }}
  //                   required
  //                 />

  //                 { !registerProcessRunning? 
  //                 <ButtonView style={{marginTop: '40px'}}
  //                   onClick={() => {
  //                     registerFormValidate()
  //                   }}
  //                   >
  //                      <span>
  //                       Submit!
  //                   </span>
  //                 </ButtonView>: 
  //                 <ButtonView style={{marginTop: '40px'}}>
  //                   <span>
  //                     <CircularProgress />
  //                   </span>
  //                 </ButtonView>
                  
                  
  //                 }
  //               </FixedForm>
  //             :<></>
  //           }
  //           {
  //             cardSelected !== ""?
  //             <ImageView>
  //               <h1>
  //                 {playerSelected?.nick_name !== ""? playerSelected?.nick_name: ""}
  //               </h1>
  //               <img
  //                 className="imageSelector"
  //                 src={cardSelected}
  //                 alt={"Hello"}
  //                 loading="lazy"
  //                 style={{
  //                   height: (500).toString()+'px',
  //                   width: (300).toString()+'px',
  //                 }}
  //                 key={uuidv4()}
  //               />
  //             </ImageView>
  //               :<> </>
  //           }
  //         </BoxWrapper2>
  //       </>
  //     }
  //   </div>
    
  // }

  return(
    <div>
      <NotificationMessageHelper />
      <ServerListWindow />
      <Loader />
      {/* {!gameStarted ? totalUI: animationUI} */}
      {/* {(!playerSelectedBool || gameStarted)? totalUI: animationUI} */}

      {/* {totalUI} */}
      {/* {(!playerSelectedBool || gameStarted)? totalUI: animationUI} */}

      {gameStarted?
        <>
        <NotificationMessageHelper />
        <>
          {ProfilemenuClicked && <NewMenuSideBar />}
        </>
        
        <InventoryView />
        <EquipView />
        <BroadCastCombiner2 />
        <ATMView />
        <InGameAssetPurchase />
        <BroadcastingAnnouncement />
        {/* <RegisterNow /> */}
        {/* <RegisterNewUserInGame /> */}
        <ControlsInfo />
        <Chat />
        <PlayersInfo />
        <QueueAddInfoWindow />
        <NewWinnersReceipt />
        <SendingFriendRequest />
        <Footer />
      </>:
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: '5%'
      }}>
        {
          (bitFighterNFTData.length == 0 && (loggedInUserWalletAddress !== "") && bitfightersLoadedBool)?
          <Content>
              <Title>  :( No Bit Fighters detected in this wallet. </Title>
              <Link 
                className="primary" 
                to="/mint" 
              >
                <ButtonView variant="contained">
                  <span>
                    Mint BitFighters
                  </span>
                </ButtonView>
              </Link>
          </Content>
          :
          (bitFighterNFTData.length == 0 && (loggedInUserWalletAddress !== "") && !bitfightersLoadedBool)?
          <Content>
            <Title> Loading.. </Title>
          </Content>:
          (loggedInUserWalletAddress === "")?
          <Content>
            <Title> Checking for Bitfighters </Title>
          </Content>
            :
          <>
            <BoxWrapper sx={{ flexGrow: 1}}>
              <Grid container spacing={0}>

                {bitFightersTotalData.map((data) => (
                  <Grid key={uuidv4()} item xs={3} style={{
                    border: '2px solid #bababa'
                  }}>
                    <HtmlTooltip title={
                      <React.Fragment>
                          {
                            data.data.attributes.map(((attr: {trait_type: any, value: any} )=> {
                              return(
                                attr.trait_type === "Defense"?
                                <AttributeInfo>
                                  <img 
                                    src="bitfgihter_assets/icons/diamond_icon.png" 
                                    alt="." />
                                  <h5> Defense : {attr.value} </h5>
                                </AttributeInfo>
                                
                                :
                                attr.trait_type === "Health"?
                                <AttributeInfo>
                                  <img 
                                    src="bitfgihter_assets/icons/heart_icon.png" 
                                    alt="." />
                                  <h5> Health : {attr.value} </h5>
                                </AttributeInfo>:
                                attr.trait_type === "Kick"?
                                <AttributeInfo>
                                  <img 
                                    src="bitfgihter_assets/icons/kick_icon.png" 
                                    alt="." />
                                  <h5> Kick : {attr.value} </h5>
                                </AttributeInfo>:
                                attr.trait_type === "Punch"?
                                <AttributeInfo>
                                  <img 
                                    src="bitfgihter_assets/icons/punch_icon.png" 
                                    alt="." />
                                  <h5> Punch : {attr.value} </h5>
                                </AttributeInfo>:
                                attr.trait_type === "Speed"?
                                <AttributeInfo>
                                  <img 
                                    src="bitfgihter_assets/icons/flash_icon.png" 
                                    alt="." />
                                  <h5> Speed : {attr.value} </h5>
                                </AttributeInfo>:
                                attr.trait_type === "Stamina"?
                                <AttributeInfo>
                                  <img 
                                    src="bitfgihter_assets/icons/water_drop_icon.png" 
                                    alt="." />
                                  <h5> Stamina : {attr.value} </h5>
                                </AttributeInfo>:
                              <></>
                            )
                            
                            })) 
                          }
                      </React.Fragment>
                    }>
                      <Grid key={uuidv4()}>
                        <ListImageView>
                        <h1>
                          {data?.nick_name !== ""? data?.nick_name: "?"}
                        </h1>

                        {/* <h1 style={{
                          position:'relative',
                          left: `-50px`,
                        }}>
                          {data.data.total_ap}
                        </h1> */}
                        <img
                          // src={`${data.data.first_frame_image}?w=164&h=164&fit=crop&auto=format`}
                          // srcSet={`${data.data.first_frame_image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          src={`${data.data.first_frame_image}`}
                          alt={"Hero"}
                          loading="lazy"
                          style={{
                            marginBottom: '20px',
                            // marginTop: '-10px'
                            // aspectRatio: `${15/16}`,
                            // backgroundColor: 'red'
                          }}
                          onClick={() => {
                            handlePlayerSelection(data)
                          }}
                        />
                        </ListImageView>
                      </Grid>
                    </HtmlTooltip>
                  </Grid>
                ))}
              </Grid>
            </BoxWrapper>

            <BoxWrapper2>
              {
                (cardSelected !== "" && selectedPlayer.nick_name === "")?
                  <FixedForm>
                    <h2>
                      Register your Fighter
                    </h2>

                    <label htmlFor="nick_name" style={{
                      marginTop: '20px'
                    }}> Name: </label>
                    <input
                      id="nick_name"
                      type="text"
                      placeholder='up to 12 letters'
                      value={formNickNameame}
                      onChange={(e) => {
                        setFormNickName(e.target.value);
                      }}
                      required
                    />
                    <br />

                    <label htmlFor="lucky_number" style={{
                      marginTop: '20px'
                    }}> Lucky #: </label>
                    <input
                      id="lucky_number"
                      type="text"
                      placeholder='(1-100)'
                      onChange={(e) => {
                        setFormLuckyNumber(parseInt(e.target.value));
                      }}
                      required
                    />

                    { !registerProcessRunning? 
                    <ButtonView style={{marginTop: '40px'}}
                      onClick={() => {
                        registerFormValidate()
                      }}
                      >
                        <span>
                          Submit!
                      </span>
                    </ButtonView>: 
                    <ButtonView style={{marginTop: '40px'}}>
                      <span>
                        <CircularProgress />
                      </span>
                    </ButtonView>
                    
                    
                    }
                  </FixedForm>
                :<></>
              }
              {
                cardSelected !== ""?
                <ImageView>
                  <h1>
                    <span style={{fontSize: '30px', color: 'grey'}}>{playerSelected?.minted_id}</span>. {playerSelected?.nick_name !== ""? playerSelected?.nick_name: ""}
                  </h1>
                  <img
                    className="imageSelector"
                    src={cardSelected}
                    alt={"Hello"}
                    loading="lazy"
                    style={{
                      height: (500).toString()+'px',
                      width: (300).toString()+'px',
                    }}
                    key={uuidv4()}
                  />
                </ImageView>
                  :<> </>
              }
            </BoxWrapper2>
          </>
        }
      </div>

      }
    </div>
  )
}
export default NewFighters;
