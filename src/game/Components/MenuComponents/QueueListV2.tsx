
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { v4 as uuidv4 } from 'uuid';
import store from "../../../stores";
import CloseIcon from '@mui/icons-material/Close';
import { getEllipsisTxt } from "../../../utils";
import phaserGame from '../../../PhaserGame';
import Game from '../../scenes/Game';
import Bootstrap from '../../scenes/Bootstrap';
import { useAppSelector } from '../../../hooks';
import { isNullOrUndefined } from 'util';
import styled from 'styled-components';
import { parseWBTCBalanceV3 } from '../../../utils/web3_utils';
import { useState } from 'react';
// import { ChangeBetWindowViewState, ChangeBetingOnPlayerData } from '../../../stores/UserActions';
import {  updateBetInfOfPlayer } from '../../../utils/fight_utils';
import { IQueueCombined } from '../../../stores/UserWebsiteStore';
import { Box, Button, Divider, Grid, InputBase, ListItemButton } from '@mui/material';
import { BetOnOtherPlayerAndFightId, fetchPlayerWalletInfo } from '../../../hooks/ApiCaller';
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../../../stores/NotificationStore';
import QueueListPlayerView from './QueueListPlayerView';
// import { QueueSingleEntry } from '../../../utils/interface';
// import { BetData } from '../../../utils/fight_utils';


function lotsOfStringGenrator() {
  const arr: string[] = []
  for (let i = 0; i< 100; i++) {
    arr.push(uuidv4())
  }
  return arr;
}

const ListItemViews = styled.div`
  img {
    height: 60px;
  }

  h1 {
    color: aliceblue;
    font-style: bold;
    font-size: 28px;
    font-family:'Cooper Black', sans-serif;
  }
`

const BetInfoView = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  
  margin: 2px;
  padding: 0px 5px 2px 5px;
  

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
  }
  

  h3 {
    // margin-top: 5px;
    font-family: Monospace;
    font-style: bold;
    font-size: 14px;
    color: white;
    line-height: 75%;
    display: flex;
    align-items: center;
    

    span {
      background-color: #63a595;
      border-radius: 10px;
      padding: 10px;
      display: flex;

      font-family: Monospace;
      font-style: bold;
      font-size: 14px;
    }
  }
`

const FormInputView = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  
  margin: 2px;
  padding: 0px 5px 2px 5px;
  

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
  }
  

  h3 {
    // margin-top: 5px;
    font-family: Monospace;
    font-style: bold;
    font-size: 14px;
    color: white;
    line-height: 75%;
    display: flex;
    align-items: center;
    

    span {
      background-color: #63a595;
      border-radius: 10px;
      padding: 10px;
      display: flex;

      font-family: Monospace;
      font-style: bold;
      font-size: 14px;
    }
  }
`


const ImageAndTextView = styled.div`
  border: 4px solid #000000;
  border-radius: 6px;
  // border-color: red;
`

const ImageView = styled.div`
  margin: 4px;
  margin-top: 20px;
  border: 5px solid #000000;
  background-color: #232323;
  // border-color: red;
`

const BackDrop = styled.div`
  width: 100%;

`

const InputTextField = styled(InputBase)`
  // border-radius: 1px 1px 10px 10px;
  border: 2px solid #000000;
  input {
    // padding: 5px;
  }
`

interface QueueWindowInfo {
  player_id: string;
  profile_image: string,
  nick_name: string,
  wallet: string, 
  fight_id: string,
  total_bet: number,
  p1_total_bet: number,
  p2_total_bet: number,
}

export default function QueueListV2() {
  // const [betWindowOpen, setBetWindowOpen] = useState(false);
  // const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)

  const combinedQueueData = useAppSelector((state) => state.userPathStore.CombinedQueueData)

  const [betOnPlayer, setBetOnPlayer] = useState(0)
  const [tipOnPlayer, setTipOnPlayer] = useState(0)
  const [fight_id_selected, setFightIdSelected] = useState("")
  const [playerSelected, setPlayerSelected] = useState("")
  const [betLastEdit, setBetLastEdit] = useState(false)

  const [betState, setBetState] = useState("BET")

  // const bet_queue_view_map = useAppSelector((state) => state.queueDetailedInfo.bet_queue_view_map)

  // if (Object.keys(bet_queue_view_map).length === 0) {
  //     "bet_amount": 0,
  //     "tip_amount": 0,
  //     "fight_id_selected": "",
  //     "player_id_selected": "",
  //     "last_edit_bet": false,
  // }
  // const playersBetInfo = useAppSelector((state) => state.userPathStore.playersBetInfo)
  // const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)
  // console.log("debug__queueDetailsInfo ",queueDetailsInfo)
  
  // const [playerChosen, setPlayerChosen] = useState<string>();
  // const [fightIdChosen, setFightIdChosen] = useState<string>();

  // const [betOnPlayer, setBetOnPlayer] = useState(0)
  // const [tipOnPlayer, setTipOnPlayer] = useState(0)
  // const [betLastEdit, setBetLastEdit] = useState(false);
  // const [tipLastEdit, setTipLastEdit] = useState(false);

  // const [betState, setBetState] = useState("Bet")

  // const game = phaserGame.scene.keys.game as Game
  // const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;

  // const deleteUserFromQueue = async () => {
  //   console.log("delete user from queue pressed..")
  //   game.lobbySocketConnection.send(JSON.stringify({
  //     event: "delete_queue",
  //     walletAddress: store.getState().web3store.userAddress
  //   }))
  //   bootstrap.play_snap_sound()
  // }

  // const addBetToFightPlayer = async () => {
  //   console.log("queue bet ,, ", fightIdChosen, playerChosen, betOnPlayer, tipOnPlayer)
  //   setBetState("....")
  //   if (betOnPlayer <= 0 || isNullOrUndefined(betOnPlayer)) {
  //     store.dispatch(SetFailureNotificationBool(true))
  //     store.dispatch(SetFailureNotificationMessage("Set Proper Bet Amount"))
  //     return
  //   }
  //   if (tipOnPlayer < 0 || tipOnPlayer > 100 || isNullOrUndefined(tipOnPlayer)) {
  //     store.dispatch(SetFailureNotificationBool(true))
  //     store.dispatch(SetFailureNotificationMessage("Tip should be a percent between 0 to 100"))
  //     return
  //   }
  //   if (!fightIdChosen) {
  //     store.dispatch(SetFailureNotificationBool(true))
  //     store.dispatch(SetFailureNotificationMessage("Unexpected error"))
  //     return
  //   }
  //   if (!playerChosen) {
  //     store.dispatch(SetFailureNotificationBool(true))
  //     store.dispatch(SetFailureNotificationMessage("Unexpected error"))
  //     return
  //   }
  //   const {success, data} = await BetOnOtherPlayerAndFightId(betOnPlayer * 100, fightIdChosen, playerChosen, tipOnPlayer);
  //   if (success) {
  //     // 
  //     console.log(" queue betting added ", success);
  //     // FetchFightInfo(fightIdChosen)
  //     fetchPlayerWalletInfo()
  //     setBetState("Confirmed")
  //     // await fetchPlayerWalletInfo()
  //     setTimeout(() => {
  //       updateBetInfOfPlayer()
  //       setBetState("Bet")
  //       setBetOnPlayer(0)
  //       setTipOnPlayer(0)
  //     }, 1000)
  //   } else {
  //     alert(data)
  //   }
  // }

  const addBetToFightPlayer = async () => {
    console.log("queue_bet ,, ", fight_id_selected, playerSelected, betOnPlayer, tipOnPlayer)
    setBetState("....")
    if (betOnPlayer <= 0 || isNullOrUndefined(betOnPlayer)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Set Proper Bet Amount"))
      return
    }
    if (tipOnPlayer < 0 || tipOnPlayer > 100 || isNullOrUndefined(tipOnPlayer)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Tip should be a percent between 0 to 100"))
      return
    }
    if (!fight_id_selected) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Unexpected error"))
      return
    }
    if (!playerSelected) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Unexpected error"))
      return
    }
    const {success, data} = await BetOnOtherPlayerAndFightId(betOnPlayer * 100, fight_id_selected, playerSelected, tipOnPlayer);
    if (success) {
      console.log(" queue betting added ", success);
      // updateSingleBetInfOfPlayer(fight_id_selected)
      fetchPlayerWalletInfo()
      setBetState("Confirmed")
      await fetchPlayerWalletInfo()
      setTimeout(() => {
        // updateSingleBetInfOfPlayer(fight_id_selected)
        updateBetInfOfPlayer()
        setBetState("Bet")
        setBetOnPlayer(0)
        setTipOnPlayer(0)
      }, 2000)
    } else {
      alert(data)
      setBetState("Bet")
      setBetOnPlayer(0)
      setTipOnPlayer(0)
    }
  }

  // const Selected_player_view = (data: QueueWindowInfo) => {
  //   return (
  //         <ImageAndTextView>
  //           <ImageView>

  //             {
  //               (data.wallet === store.getState().web3store.userAddress) ?
  //                 <div style={{
  //                   float: 'right'
  //                 }}>
  //                   <CloseIcon
  //                       style={{color: 'red'}} 
  //                       onClick={() => {
  //                         console.log("pressed close icon")
  //                         deleteUserFromQueue()
  //                       }}
  //                     />
  //                 </div>:<></>
  //               }

  //             <ListItemButton>
  //               <img
  //                 src={data.profile_image}
  //                 alt="Hero"
  //               />
  //               <ListItemText
  //                 primary={
  //                   <span style={{
  //                     color: "aliceblue",
  //                   }}>
  //                     {data.nick_name}
  //                   </span>
  //                 } 
  //                 secondary={getEllipsisTxt(data.wallet)} 
  //               />
  //             </ListItemButton>
  //           </ImageView>
          
  //           <BetInfoView>
  //             {
  //               data.player_id == "p1"?
  //               <h3>
  //                 Total Bet: <span> { parseWBTCBalanceV3(queueDetailsInfo[data.fight_id]["total_bet_p1"]+ queueDetailsInfo[data.fight_id]["self_bet_p1"]) } </span>
  //               </h3>:
  //               <h3>
  //                 Total Bet: <span> { parseWBTCBalanceV3(queueDetailsInfo[data.fight_id]["total_bet_p2"]+ queueDetailsInfo[data.fight_id]["self_bet_p2"]) } </span>
  //               </h3>
  //             }
  //           </BetInfoView>

  //           <FormInputView>

  //             <Box sx={{ flexGrow: 1 }}>
  //               <Grid container spacing={0}>
  //                 <Grid item xs={5.5}>

  //                   <h3>
  //                     Your Bet: 
  //                     <InputTextField
  //                       type='number'
  //                       fullWidth
  //                       // autoFocus={betLastEdit}
  //                       value={betOnPlayer}
  //                       // onFocus={() => {
  //                       //   setBetLastEdit(true)
  //                       //   setTipLastEdit(false)
  //                       // }}
  //                       // onBlur={()=> {
  //                       //   setBetLastEdit(false)
  //                       //   setTipLastEdit(true)
  //                       // }}
  //                       onChange={(e) => {
  //                         console.log("writing ", e.target.value)
  //                         if (e.target.value === "") {
  //                           setBetOnPlayer(0)
  //                         } else {
  //                           setBetOnPlayer(parseInt(e.target.value))
  //                         }
  //                       }}
  //                     />
  //                   </h3>
  //                 </Grid>
  //                 <Grid item xs={1}></Grid>
  //                 <Grid item xs={5.5}>
  //                   <h3>
  //                     Tip: 
  //                     <InputTextField
  //                       type='number'
  //                       fullWidth
  //                       autoFocus={tipLastEdit}
  //                       value={tipOnPlayer}
  //                       // onFocus={() => {
  //                       //   setBetLastEdit(false)
  //                       //   setTipLastEdit(true)
  //                       // }}
  //                       // onBlur={()=> {
  //                       //   setBetLastEdit(true)
  //                       //   setTipLastEdit(false)
  //                       // }}
  //                       onChange={(e) => {
  //                         console.log("writing ", e.target.value)
  //                         if (e.target.value === "") {
  //                           setTipOnPlayer(0)
  //                         } else {
  //                           setTipOnPlayer(parseInt(e.target.value))
  //                         }
  //                       }}
  //                     />
  //                   </h3>
  //                 </Grid>
  //               </Grid>
  //             </Box>
              

              
  //           </FormInputView>
            

  //           <div style={{
  //             display: "flex",
  //             flexDirection: 'column',
  //             justifyContent: 'column',
  //             alignItems: 'center',
  //           }}>
  //             <Button 
  //               variant="contained" 
  //               color="secondary"
  //               style={{
  //                 width: '20px',
  //                 borderRadius: '10px',
  //                 justifyContent: 'center',
  //                 height: '25px'
  //               }}
  //               onClick={addBetToFightPlayer}
  //             >
  //               {betState}
  //             </Button>
  //           </div>
  //         </ImageAndTextView>
  //   )
  // }

  return (
    <div>
        <List>
        {
          !isNullOrUndefined(combinedQueueData) && combinedQueueData.length > 0 &&
          combinedQueueData.map((data: IQueueCombined, index) => {
            return (
              <BackDrop key={uuidv4()}>
                <ListItem disablePadding key={uuidv4()}>
                  <ListItemViews>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={0.5} >

                        <Grid item xs={1} style={{
                            display: 'flex',
                            padding: '10px',
                            alignItems: 'center'
                          }}>
                            <h1 style={{color: 'aliceblue' }}> {index + 1} </h1>
                        </Grid>

                        <Grid item xs={5.5}>
                          <QueueListPlayerView 
                            player_id={"p1"}
                            fight_id={data.fight_id} 
                            wallet={data.p1_wallet} 
                            nick_name={data.p1_nick_name} 
                            profile_image={data.p1_profile_image} 
                            total_bet={data.total_bet} 
                            p1_total_bet={data.p1_total_bet}
                            p2_total_bet={0}
                            extra_data={{
                              bet_amount: betOnPlayer,
                              setBetOnPlayer: setBetOnPlayer,

                              tip_amount: tipOnPlayer,
                              setTipOnPlayer: setTipOnPlayer,

                              fight_id_selected: fight_id_selected,
                              setFightIdSelected: setFightIdSelected,

                              player_id_selected: playerSelected,
                              setPlayerSelected: setPlayerSelected,

                              last_edit_bet: betLastEdit,
                              setBetLastEdit: setBetLastEdit,

                              betState: betState,
                              addBetToFightPlayer:addBetToFightPlayer
                            }}
                          />
                        </Grid>

                        <Grid item xs={5.5}>
                          <QueueListPlayerView 
                            player_id={"p2"}
                            fight_id={data.fight_id} 
                            wallet={data.p2_wallet} 
                            nick_name={data.p2_nick_name} 
                            profile_image={data.p2_profile_image} 
                            total_bet={data.total_bet} 
                            p2_total_bet={data.p2_total_bet}
                            p1_total_bet={0}
                            extra_data={{
                              bet_amount: betOnPlayer,
                              setBetOnPlayer: setBetOnPlayer,

                              tip_amount: tipOnPlayer,
                              setTipOnPlayer: setTipOnPlayer,

                              fight_id_selected: fight_id_selected,
                              setFightIdSelected: setFightIdSelected,

                              player_id_selected: playerSelected,
                              setPlayerSelected: setPlayerSelected,

                              last_edit_bet: betLastEdit,
                              setBetLastEdit: setBetLastEdit,

                              betState: betState,
                              addBetToFightPlayer:addBetToFightPlayer
                            }}
                          />
                        </Grid>

                      </Grid>
                    </Box>
                  </ListItemViews>

                  <Divider />
                </ListItem>
              </BackDrop>
            )
          })
        }
        </List>
    </div>
  )
}