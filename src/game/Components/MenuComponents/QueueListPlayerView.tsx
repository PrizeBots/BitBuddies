
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
import { useEffect, useState } from 'react';
// import { ChangeBetWindowViewState, ChangeBetingOnPlayerData } from '../../../stores/UserActions';
import { Box, Button, Divider, Grid, InputBase, ListItemButton } from '@mui/material';
import { BetOnOtherPlayerAndFightId, fetchPlayerWalletInfo } from '../../../hooks/ApiCaller';
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../../../stores/NotificationStore';
import { type } from 'os';
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
  flex-direction: row;
  justify-content: start;
  align-items: start;
  gap: 20px;
  
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
  border-radius: 10px;
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
  extra_data: any
}

export default function QueueListPlayerView(queueWindowData: QueueWindowInfo) {
  const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)
  const playersBetInfo = useAppSelector((state) => state.userPathStore.playersBetInfo)

  const game = phaserGame.scene.keys.game as Game
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;

  let required_bet_info_index = -1;
  for(let i=0; i < playersBetInfo.length; i++) {
    if (queueWindowData.fight_id === playersBetInfo[i].fight_id) {
      required_bet_info_index = i;
    }
    console.log("debug_bets___", playersBetInfo[required_bet_info_index])
  }

  const deleteUserFromQueue = async () => {
    console.log("delete user from queue pressed..")
    game.lobbySocketConnection.send(JSON.stringify({
      event: "delete_queue",
      walletAddress: store.getState().web3store.userAddress
    }))
    bootstrap.play_snap_sound()
  }

  const onChangeBetAmount = (e: any, fight_id: string, player_id: string) => {
    console.log("debug_bet_ui_view_writing_bet ", e.target.value, typeof e.target.value)
    let tempBet = 0
    if (e.target.value !== "") {
      tempBet = parseInt(e.target.value)
      // queueWindowData.extra_data.set(parseInt(e.target.value))
    }
    queueWindowData.extra_data.setBetOnPlayer(tempBet)
    queueWindowData.extra_data.setBetLastEdit(true)
    queueWindowData.extra_data.setFightIdSelected(fight_id)
    queueWindowData.extra_data.setPlayerSelected(player_id)
  }

  const onChangeTipAmount = (e: any, fight_id: string, player_id: string) => {
    console.log("debug_bet_ui_view_writing_tip ", e.target.value)
    let tempTip = 0
    if (e.target.value !== "") {
      tempTip = parseInt(e.target.value)
    }
    if (tempTip > 99) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Upto 100"))
      return
    }
    queueWindowData.extra_data.setTipOnPlayer(tempTip)
    queueWindowData.extra_data.setBetLastEdit(false)
    queueWindowData.extra_data.setFightIdSelected(fight_id)
    queueWindowData.extra_data.setPlayerSelected(player_id)
  }


  useEffect(() => {
    console.log("debug_bet_ui_view", queueWindowData.extra_data.betOnPlayer)
  }, [queueWindowData.extra_data.betOnPlayer])

  return (
    <div>
      <ImageAndTextView>
        <ImageView>

          {
            (queueWindowData.wallet === store.getState().web3store.userAddress) ?
              <div style={{
                float: 'right'
              }}>
                <CloseIcon
                    style={{color: 'red'}} 
                    onClick={() => {
                      console.log("pressed close icon")
                      deleteUserFromQueue()
                    }}
                  />
              </div>:<></>
            }

          <ListItemButton>
            <img
              src={queueWindowData.profile_image!== ""?queueWindowData.profile_image: "/new_assets/questionGIF.gif"}
              alt="Hero"
            />
            {/* <img
              src={queueWindowData.profile_image}
              alt="Hero"
            /> */}
            <ListItemText
              primary={
                <span style={{
                  color: "aliceblue",
                }}>
                  {queueWindowData.nick_name}
                </span>
              } 
              secondary={getEllipsisTxt(queueWindowData.wallet)} 
            />
          </ListItemButton>
        </ImageView>
      
        <BetInfoView>
          {
            Object.keys(queueDetailsInfo).length && queueDetailsInfo[queueWindowData.fight_id]?
            queueWindowData.player_id == "p1"?
            <h3>
              Total Bet: <span> { parseWBTCBalanceV3(queueDetailsInfo[queueWindowData.fight_id]["total_bet_p1"]+ queueDetailsInfo[queueWindowData.fight_id]["self_bet_p1"]) } </span>
            </h3>:
            <h3>
              Total Bet: <span> { parseWBTCBalanceV3(queueDetailsInfo[queueWindowData.fight_id]["total_bet_p2"]+ queueDetailsInfo[queueWindowData.fight_id]["self_bet_p2"]) } </span>
            </h3>:
            <h3>
              Total Bet: <span> { 0 } </span>
            </h3>
          }


          {
            required_bet_info_index> -1 && !isNullOrUndefined(playersBetInfo)&& queueWindowData.player_id == "p1" && playersBetInfo[required_bet_info_index].player_bet_on === queueWindowData.wallet?
            <h3>
              My Bet: <span> { parseWBTCBalanceV3(playersBetInfo[required_bet_info_index].bet_amount) } </span>
            </h3>:
            required_bet_info_index> -1 && !isNullOrUndefined(playersBetInfo)&&  queueWindowData.player_id == "p2" && playersBetInfo[required_bet_info_index].player_bet_on === queueWindowData.wallet?
            <h3>
              My Bet: <span> { parseWBTCBalanceV3(playersBetInfo[required_bet_info_index].bet_amount) } </span>
            </h3>:
            <h3>
              My Bet: <span> { 0 } </span>
            </h3>
          }

              
            

        </BetInfoView>

        <FormInputView>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={0}>
              <Grid item xs={5.5}>

                <h3>
                  Bet: 
                  <InputTextField
                    type='number'
                    fullWidth
                    autoFocus={
                      queueWindowData.extra_data.fight_id_selected===queueWindowData.fight_id 
                      && queueWindowData.wallet===queueWindowData.extra_data.player_id_selected 
                      && queueWindowData.extra_data.last_edit_bet
                    }
                    value={
                      queueWindowData.wallet===queueWindowData.extra_data.player_id_selected?
                      queueWindowData.extra_data.bet_amount:
                      0
                    }
                    onChange={(e) => {
                      onChangeBetAmount(e, queueWindowData.fight_id , queueWindowData.wallet )
                    }}
                  />
                </h3>
              </Grid>
              <Grid item xs={0.5}></Grid>
              <Grid item xs={5.5}>
                <h3>
                  Tip(%): 
                  <InputTextField
                    type='number'
                    fullWidth
                    autoFocus={
                      queueWindowData.extra_data.fight_id_selected===queueWindowData.fight_id 
                      && queueWindowData.wallet===queueWindowData.extra_data.player_id_selected 
                      && !queueWindowData.extra_data.last_edit_bet
                    }
                    value={
                      queueWindowData.wallet===queueWindowData.extra_data.player_id_selected?
                      queueWindowData.extra_data.tip_amount:
                      0
                    }
                    onChange={(e) => {
                      onChangeTipAmount(e, queueWindowData.fight_id , queueWindowData.wallet )
                    }}
                  />
                  {/* <InputTextField
                    type='number'
                    fullWidth
                    autoFocus={data.fight_id===fight_id_selected && data.wallet===playerSelected && !betLastEdit}
                    value={tipOnPlayer? data.wallet===playerSelected:0}
                    onChange={(e) => {
                      onChangeTipAmount(e, data.fight_id, data.wallet)
                    }}
                  /> */}
                </h3>
              </Grid>
            </Grid>
          </Box>
          

          
        </FormInputView>
        

        <div style={{
          display: "flex",
          flexDirection: 'column',
          justifyContent: 'column',
          alignItems: 'center',
        }}>
          <Button 
            variant="contained" 
            color="secondary"
            style={{
              width: '20px',
              borderRadius: '10px',
              justifyContent: 'center',
              height: '25px'
            }}
            onClick={queueWindowData.extra_data.addBetToFightPlayer}
          >
            {queueWindowData.extra_data.betState}
          </Button>
        </div>
      </ImageAndTextView>
    </div>
  )
}