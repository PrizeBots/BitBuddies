import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Box, Button, FormControl, Grid, ImageList, ImageListItem, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Snackbar, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel'
import phaserGame from '../PhaserGame'
import Bootstrap from '../game/scenes/Bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import Chat from '../game/Components/Chat';
import CancelIcon from '@mui/icons-material/Cancel';
import Utils from './Utils';
import { v4 as uuidv4 } from 'uuid';
import { SetCurrentGamePlayer, SetGameStarted, setNickName } from '../stores/PlayerData';
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
import { fetchNFTsFromDB, loginAndAuthenticatePlayer, updateNFTsInDB } from '../hooks/ApiCaller';
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
  color: #eee;
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
    color: black;
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
  }
`;


const BoxWrapper = styled(Box)`
  overflow-y: scroll;
  position: relative;
  background-color:#2d2a2a;
  
  height: 80vh;
  max-width: 36vw;

  color: white;
  border-right: 10px solid #626d7c;
  border-left: 10px solid #626d7c;
  border-bottom: 10px solid #626d7c;
`;




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
const vertical= 'top';
const horizontal = 'center';
// const baseHeight = 70;
// const baseWidth = 40;


function NewFighters() {
  const navigate = useNavigate();
  const { height, width } = Utils();
  let baseWidth =  width/45;
  if (getSystemInfo() ) {
    if (width > 1000) {
      baseWidth = width/40;
    } else if (width > 800) {
      baseWidth = width/35;
    } else if (width > 700) {
      baseWidth = width/30;
    } else if (width > 600) {
      baseWidth = width/20;
    } else {
      baseWidth = width/14;
    }
  }
  const baseHeight = height/14;
  // const baseWidth = width/45;
  console.log("***********baseheight", height, width, baseHeight, baseWidth)
  const bitFighterNFTData = useAppSelector((state) => state.bitFighters.nftData)
  const bitFightersTotalData = useAppSelector((state) => state.bitFighters.totalNFTData)
  console.log("--------total_data-------", bitFightersTotalData)
  console.log("--------total_data2-------", bitFighterNFTData)

  const selectedPlayer = useAppSelector(
    (state) => state.playerDataStore.current_game_player_info
  );

  const dummyBfsData: any[] = []
  const attributesHTML: Array<any> = []
  // for (let i =0 ; i < 100; i ++) {
  //   for (let j = 0; j < 5; j++) {
  //     dummyBfsData.push(bitFightersTotalData[j])
  //   }
  // }

  const loggedInUserWalletAddress = useAppSelector((state) => state.web3store.userAddress)

  const gameStarted = useAppSelector((state) => state.playerDataStore.gameStarted)

  const bitfightersLoadedBool = useAppSelector((state) => state.bitFighters.loaded)

  console.log("current path 333 ", gameStarted)

  const [formNickNameame, setFormNickName] = useState("")
  const [formLuckyNumber, setFormLuckyNumber] = useState(1)

  const [game_server, set_game_server ]= useState("Washington_DC")

  const [registerProcessRunning, setRegisterProcessRunning] = useState(false)

  const [playerSelectedBool, setPlayerSelectedBool] = useState(false);
  const [snackBarOpen , setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [playerSelected, setPlayerSelected] = useState<IPlayerData>();
  // const [gameStarted, setGameStarted] = useState(false);
  const [cardSelected, setCardSelected] = useState("")
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  let noBitFighter = false;
  let boxWidth = 500;
  let carouselUI = null;
  // let NewUI = null;
  let totalUI = null;
  let animationView = <>Animation View</>;
  let animationUI = null;
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setSnackBarOpen(false);
  };

  const [openModal, setOpenModal] = useState(false);
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  }

  const SelectGameServerAndLoadInfo = async (region: string) => {
    ListGameServers(region)
    console.log("in SelectGameServerAndLoadInfo", region)
    set_game_server(region);
  }
  
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
      ListGameServers(game_server)
    }

    
    // console.log("game start -> ", playerSelected)
  }

  const startGame = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    
    // if (bodyHtml) {
    //   bodyHtml.style.zoom = "80%";
    //   // bodyHtml.style.webkitTransform = "rotate(90deg)";
    // }
    // navigate("/game", { replace: true });
    const playerAuthToken = await loginAndAuthenticatePlayer(playerSelected!.user_wallet_address, playerSelected!.minted_id);
    if (!isNullOrUndefined(playerAuthToken)) {
      store.dispatch(setPlayerAuthToken(playerAuthToken))
      dispatch(SetGameStarted(true));

      store.dispatch(SetSelectedGameServerURL(REACT_APP_LOBBY_WEBSOCKET_SERVER));
      
      // dispatch(SetCurrentGamePlayer(playerSelected))

      // dispatch(setNickName(playerSelected!.nick_name))
      // const bodyHtml = document.querySelector('html');
      // console.log("bodyhtml ", bodyHtml);
      store.dispatch(SetGameLoadingState(true))
      bootstrap.launchGame(playerSelected)
    }
    
  }

  const registerFormValidate = async () => {
    setRegisterProcessRunning(true)

    console.log("in ---- register fn... ", formLuckyNumber, formNickNameame)

    if (!(formLuckyNumber > 0 && formLuckyNumber < 100)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Lucky Number should be 0-100"))
      setRegisterProcessRunning(false)
      return
    }

    if (!(formNickNameame.length > 5 && formNickNameame.length < 11)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Nick name should be of length 5-10"))
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
      await updateNFTsInDB(store.getState().web3store.userAddress);
      const result = await fetchNFTsFromDB(store.getState().web3store.userAddress);
      console.log("-------dataofnfts--*******-- .", result);

      const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
      console.log("dataofnfts -- ", dataOfNFTS )

      store.dispatch(setTotalNFTData(result.message))
      store.dispatch(setNFTDetails(dataOfNFTS))
    }

    setRegisterProcessRunning(false)
    
  }

  const carouselItems = [];
  let carouselItemsLength = 5;
  const nftDataCopy = [];
  const nftTotalData = [];
  // store.dispatch(SetShowGameServersList(true));

  useEffect(() => {
    if (bitFighterNFTData.length > 0) {
      // store.dispatch(SetShowGameServersList(true));
    }
    
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
    carouselUI = <Title>  :( No Bit Fighters detected in this wallet. </Title>
    // totalUI = <Title>  :( No Bit Fighters detected in this wallet. </Title>
    boxWidth = 400;
    noBitFighter = true;
  } else if (bitFighterNFTData.length == 0 && (loggedInUserWalletAddress !== "") && !bitfightersLoadedBool) {
    carouselUI = <Title> Loading.. </Title>
    boxWidth = 400;
    noBitFighter = true;
  } else if (loggedInUserWalletAddress === "") {
    carouselUI = <Title>  Checking for Bitfighters </Title>
    boxWidth = 400;
    noBitFighter = true;
  } else {
    if (!gameStarted) {
      store.dispatch(SetShowGameServersList(true));
    } else {
      store.dispatch(SetShowGameServersList(false));
    }
    

    for(let i = 0; i < bitFighterNFTData.length + carouselItemsLength -1; i++) {
      if (i < bitFighterNFTData.length) {
        nftDataCopy[i] = bitFighterNFTData[i]
        nftTotalData[i] = bitFightersTotalData[i]
        continue
      } else {
        nftDataCopy[i] = bitFighterNFTData[i - bitFighterNFTData.length]
        nftTotalData[i] = bitFightersTotalData[i - bitFighterNFTData.length]
      }
    }


    if (getSystemInfo()) {
      boxWidth = 300 * 1;
      carouselItemsLength = 1;
    } else {
      if (bitFighterNFTData.length >= 5) {
        boxWidth = 300 * 3;
        carouselItemsLength = 5;
      } else {
        boxWidth = 300 * bitFighterNFTData.length;
        carouselItemsLength = bitFighterNFTData.length;
      }
    }
    
    // console.log("@@#$%$#@#$$#@", bitFighterNFTData.length, boxWidth, carouselItemsLength, "#$%^&*(")

    let count = 0;
    let width = baseWidth;
    let height = baseWidth;
    for (let i = 0 ; i < bitFighterNFTData.length; i++) {
      // console.log("-----carouselItemsLength- i--", i, carouselItemsLength)
      count = 0;
      width = baseWidth;
      height = baseHeight;
      carouselItems.push(
      // <Card raised className="Banner" key={i.toString()} style={{backgroundColor: "#A1A7B8"}}>
        <Grid container spacing={0} >
          {nftTotalData.slice(i, i + carouselItemsLength).map((da, index) => {
            // console.log(" ---------- da -- index ----------- ", index, da)
            if (carouselItemsLength === 5) {
              if ((index === 1) || (index === 3)) {
                height = baseHeight*5;
                width = baseWidth*5;
              } else if (index === 2) {
                height = baseHeight*6;
                width = baseWidth*6;
              } else if ((index === 0) || (index === 4)) {
                height = baseHeight*4;
                width = baseWidth*4;
              }
            } else if (carouselItemsLength === 1 || carouselItemsLength === 2) {
              height = baseHeight*6;
              width = baseWidth*6;
            } else if (carouselItemsLength === 3) {
              if ((index === 2)) {
                height = baseHeight*5;
                width = baseWidth*5;
              } else if (index === 1) {
                height = baseHeight*6;
                width = baseWidth*6;
              } else if ((index === 0)) {
                height = baseHeight*5;
                width = baseWidth*5;
              }
            } else if (carouselItemsLength === 4) {
              if ((index === 1) || (index === 2)) {
                height = baseHeight*6;
                width = baseWidth*6;
              } else if ((index === 0) || (index === 3)) {
                height = baseHeight*4;
                width = baseWidth*4;
              }
            } 
            // console.log('height , width, ', height, width, baseHeight, baseWidth)

            return (
              <ImageWraper key={uuidv4()}>
                <HeadingText>{da.nick_name}</HeadingText>
                <img
                  className="imageSelector"
                  src={da.data.image}
                  alt={"Hello"}
                  loading="lazy"
                  key={uuidv4()}
                  style={{
                    height:`${height}px`,
                    width:`${width}px`,
                  }}
                  onClick={() => handlePlayerSelection(da)}
                />
              </ImageWraper>
            )
          })}
        </Grid>
      )
    }
  }

  animationView = <div>
      <div style={{position:'absolute'}}>
        <Tooltip title="Click to go back">
          <CancelIcon
            color='disabled'
            style={{float:"left"}}
            fontSize='large'
            onClick={() => {
              setPlayerSelectedBool(false)
              store.dispatch(SetShowGameServersList(false));
              bootstrap.play_select_sound()
            }}
            key={uuidv4()}
          />
        </Tooltip>
        
      </div>
      
      <img
        className="imageSelector"
        src={cardSelected}
        alt={"Hello"}
        loading="lazy"
        // key={(100).toString()}
        style={{
          height: (baseHeight * 7).toString()+'px',
          width: (baseWidth*7).toString()+'px',
        }}
        key={uuidv4()}
      />
  </div>

  if (gameStarted) {
    totalUI = <>
      <NotificationMessageHelper />
      <NewMenuSideBar />
      <InventoryView />
      <EquipView />
      <BroadCastCombiner2 />
      <InGameAssetPurchase />
      <ATMView />
      <BroadcastingAnnouncement />
      <RegisterNow />
      <RegisterNewUserInGame />
      <ControlsInfo />
      <Chat />
      <PlayersInfo />
      <QueueAddInfoWindow />
      <WinnersReceipt />
      <SendingFriendRequest />
    </>
  } else {
    totalUI = 
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
          <BoxWrapper sx={{ flexGrow: 1 }} >

            <ImageList 
              cols={5} 
              gap={0}
            >
              {bitFightersTotalData.map((data) => (
                <ImageListItem key={uuidv4()} style={{
                  border: '1px solid #bababa'
                }}>
                  <HtmlTooltip title={
                    <React.Fragment>
                        {
                          data.data.attributes.map(((attr: {trait_type: any, value: any} )=> {
                            return(
                              attr.trait_type === "defense"?
                              <AttributeInfo>
                                <img 
                                  src="bitfgihter_assets/icons/diamond_icon.png" 
                                  alt="." />
                                <h5> Defense : {attr.value} </h5>
                              </AttributeInfo>
                              
                              :
                              attr.trait_type === "health"?
                              <AttributeInfo>
                                <img 
                                  src="bitfgihter_assets/icons/heart_icon.png" 
                                  alt="." />
                                <h5> Health : {attr.value} </h5>
                              </AttributeInfo>:
                              attr.trait_type === "kick"?
                              <AttributeInfo>
                                <img 
                                  src="bitfgihter_assets/icons/kick_icon.png" 
                                  alt="." />
                                <h5> Kick : {attr.value} </h5>
                              </AttributeInfo>:
                              attr.trait_type === "punch"?
                              <AttributeInfo>
                                <img 
                                  src="bitfgihter_assets/icons/punch_icon.png" 
                                  alt="." />
                                <h5> Punch : {attr.value} </h5>
                              </AttributeInfo>:
                              attr.trait_type === "speed"?
                              <AttributeInfo>
                                <img 
                                  src="bitfgihter_assets/icons/flash_icon.png" 
                                  alt="." />
                                <h5> Speed : {attr.value} </h5>
                              </AttributeInfo>:
                              attr.trait_type === "stamina"?
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
                    <img
                      src={`${data.data.first_frame_image}`}
                      alt={"Hero"}
                      loading="lazy"
                      style={{
                        margin: '10px',
                        aspectRatio: `${12/16}`
                      }}
                      onClick={() => {
                        handlePlayerSelection(data)
                      }}
                    />
                  </HtmlTooltip>
                </ImageListItem>
              ))}
            </ImageList>
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
                    placeholder='up to 10 letters'
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

                  <ButtonView style={{marginTop: '40px'}}
                    onClick={() => {
                      registerFormValidate()
                    }}
                    >
                    { 
                       <span>
                        Submit!
                    </span>}
                  </ButtonView>
                </FixedForm>
              :<></>
            }

            {
              cardSelected !== ""?
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
                />:<> </>
            }
            
          </BoxWrapper2>
        </>
      }
    </div>
    

    animationUI = <>
      Hello
    </>
      // totalUI = <>
      //       <Title> 
      //         <div className="cooper-black-tab" style={{
      //           fontSize: '30px'
      //         }}>Your Bitfighters </div>
      //       </Title>
      //         <Content>
      //           <Box sx={{ 
      //             width: boxWidth,
      //             }}
      //           >
      //             {carouselUI}
      //           </Box>
      //           { noBitFighter 
      //             ? <div>
                    // <Link 
                    //   className="primary" 
                    //   to="/mint" 
                    // >
                    //   <ButtonView variant="contained" >
                    //     <span>
                    //       Mint BitFighters
                    //     </span>
                    //   </ButtonView>
                    // </Link>
      //             </div>
      //            : <div style={{
      //             display: 'flex',
      //             flexDirection: 'column'
      //            }}>
      //             <LoadingButton 
      //               variant="contained" 
      //               color="info"
      //               onClick={(event) => startGame(event)}
      //               loading={!playerSelectedBool}
      //               loadingIndicator="Select one"
      //           >
      //             Start Game
      //           </LoadingButton>
      //           {
      //             (!isNullOrUndefined(localStorage.getItem("connected_matic_network"))) && 
      //               <Link 
      //               className="primary" 
      //               to="/mint" 
      //             >
      //               <ButtonView 
      //                 variant="contained" 
      //                 color="info"
      //                 style={{
      //                   // width: 200,
      //                   marginTop: '30px'
      //                 }}
      //                 >
      //                   <span>
      //                     Mint BitFighters
      //                   </span>
                        
      //               </ButtonView>
      //             </Link>
      //           }

      //           </div>}

      //         </Content>
      //       </>

      // animationUI = <>
      //       <NewContent>
      //         <Box sx={{ 
      //           width: baseWidth*7,
      //           }}
      //         >
      //           {animationView}
      //         </Box>

            

      //         <ButtonView 
      //           variant="contained" 
      //           color="info"
      //           onClick={(event) => startGame(event)}
      //         >
      //           <span>
      //               Start Game
      //           </span>
      //         </ButtonView>

      //     </NewContent>
      //   </>
  }

  return(
    <div>
      {/* <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackBarOpen}
        onClose={handleClose}
        message={snackBarMessage}
        key={vertical + horizontal}
      /> */}
      <NotificationMessageHelper />
      <ServerListWindow />
      <Loader />
      {/* {!gameStarted ? totalUI: animationUI} */}
      {/* {(!playerSelectedBool || gameStarted)? totalUI: animationUI} */}

      {totalUI}
      {/* {(!playerSelectedBool || gameStarted)? totalUI: animationUI} */}
    </div>
  )
}
export default NewFighters;
