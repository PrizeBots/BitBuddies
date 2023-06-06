
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
import { BetData, updateBetInfOfPlayer } from '../../../utils/fight_utils';
import { IQueueCombined } from '../../../stores/UserWebsiteStore';
import { Box, Button, Divider, Grid, InputBase, ListItemButton } from '@mui/material';
import { BetOnOtherPlayerAndFightId, fetchPlayerWalletInfo } from '../../../hooks/ApiCaller';
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../../../stores/NotificationStore';
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
  // display: flex;
  // flex-direction: row;
  // align-items: center;
  img {
    height: 60px;
    // width: 40%;
    // margin-left: -5px;
  }
`

const BetInfoView = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  margin: 2px;
  padding: 2px 5px 2px 5px;
  

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

interface TempBets {
  fight_id: string;

}

const ImageAndTextView = styled.div`
  border: 4px solid #000000;
  border-radius: 6px;
`

const ImageView = styled.div`
  margin: 4px;
  border: 5px solid #000000;
  background-color: #232323;
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

export default function QueueList() {
  const [betWindowOpen, setBetWindowOpen] = useState(false);
  // delete User from queue
  // const queueData = useAppSelector((state) => state.userPathStore.QueueData)
  const combinedQueueData = useAppSelector((state) => state.userPathStore.CombinedQueueData)
  const playersBetInfo = useAppSelector((state) => state.userPathStore.playersBetInfo)
  const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)
  // console.log("LoopAllFightsAndUpdate--1-", queueDetailsInfo)
  
  const [playerChosen, setPlayerChosen] = useState<string>();
  const [fightIdChosen, setFightIdChosen] = useState<string>();

  const [betOnPlayer, setBetOnPlayer] = useState(0)
  const [tipOnPlayer, setTipOnPlayer] = useState(0)
  const [betLastEdit, setBetLastEdit] = useState(false);
  const [tipLastEdit, setTipLastEdit] = useState(false);

  // const p1_total_bet = useAppSelector((state) => state.fightInfoStore.total_bet_p1)
  // const p2_total_bet = useAppSelector((state) => state.fightInfoStore.total_bet_p2)


  const [betState, setBetState] = useState("Bet")

  // console.log("queue -- playersbetinfo ", playersBetInfo)
  // const copyNewQueueData = Array(3).fill(combinedQueueData)
  const game = phaserGame.scene.keys.game as Game
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;

  const deleteUserFromQueue = async () => {
    console.log("delete user from queue pressed..")
    // const success =await ExitFromFight()
    // if (!success) {
    //   alert("Failed to remove in Queue")
    //   // setaddToQueueBool(false);
    //   // setaddToQueueState("");
    //   return
    // }
    // // if (res=== null) return
    // // setTimeout(() => {})
    game.lobbySocketConnection.send(JSON.stringify({
      event: "delete_queue",
      walletAddress: store.getState().web3store.userAddress
    }))
    bootstrap.play_snap_sound()
    // // bootstrap.play_err_sound()
  }

  const addBetToFightPlayer = async () => {
    console.log("queue bet ,, ", fightIdChosen, playerChosen, betOnPlayer, tipOnPlayer)
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
    if (!fightIdChosen) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Unexpected error"))
      return
    }
    if (!playerChosen) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Unexpected error"))
      return
    }
    const {success, data} = await BetOnOtherPlayerAndFightId(betOnPlayer * 100, fightIdChosen, playerChosen, tipOnPlayer);
    if (success) {
      // 
      console.log(" queue betting added ", success);
      // FetchFightInfo(fightIdChosen)
      fetchPlayerWalletInfo()
      setBetState("Confirmed")
      // await fetchPlayerWalletInfo()
      setTimeout(() => {
        updateBetInfOfPlayer()
        setBetState("Bet")
        setBetOnPlayer(0)
        setTipOnPlayer(0)
      }, 1000)
    } else {
      alert(data)
    }
  }


  const betsInfoForFightAndPlayer: Map<string, BetData> = new Map();
  for (let i = 0; i < combinedQueueData.length; i++) {
    const tempFightId = combinedQueueData[i].fight_id;
    for (let j = 0 ; j < playersBetInfo.length; j++) {
      if (tempFightId === playersBetInfo[j].fight_id) {
        if (combinedQueueData[i].p1_wallet === playersBetInfo[j].player_bet_on) {
          betsInfoForFightAndPlayer.set(tempFightId, playersBetInfo[j]);
        }
        if (combinedQueueData[i].p2_wallet === playersBetInfo[j].player_bet_on) {
          betsInfoForFightAndPlayer.set(tempFightId, playersBetInfo[j])
        }
      }
    }
  }

  const Non_selected_player1_view = (data: IQueueCombined) => {
    return (
          <ImageAndTextView>
          <ImageView>
            <ListItemButton>
              <img
                className='hexagon-icon'
                src={data.p1_profile_image}
                alt="Hero"
              />
              <ListItemText
                primary={
                  <span style={{
                    color: "aliceblue",
                  }}>
                    {data.p1_nick_name}
                  </span>
                } 
                secondary={getEllipsisTxt(data.p1_wallet)} 
              />
            </ListItemButton>
          </ImageView>
          {/* <ListItemButton> */}
            <BetInfoView>
              <h3>
                Total Bet: <span> { parseWBTCBalanceV3(data.p1_total_bet) } </span>
              </h3>
              <Button 
                variant="contained" 
                color="secondary"
                style={{
                  width: '20px',
                  borderRadius: '10px',
                  justifyContent: 'center',
                  height: '25px'
                }}
                onClick={() => {
                  setFightIdChosen(data.fight_id)
                  setPlayerChosen(data.p1_wallet)
                }}
              >
                Bet
              </Button>
            </BetInfoView>
          {/* </ListItemButton> */}

          </ImageAndTextView>
    )
  }

  const Selected_player1_view = (data: IQueueCombined) => {
    return (
          <ImageAndTextView>
          <ImageView>
            <ListItemButton>
              <img
                className='hexagon-icon'
                src={data.p1_profile_image}
                alt="Hero"
              />
              <ListItemText
                primary={
                  <span style={{
                    color: "aliceblue",
                  }}>
                    {data.p1_nick_name}
                  </span>
                } 
                secondary={getEllipsisTxt(data.p1_wallet)} 
              />
            </ListItemButton>
          </ImageView>
          {/* <ListItemButton> */}
            <BetInfoView>
              <h3>
                Your Bet: 
                <InputTextField
                  type='number'
                  fullWidth
                  autoFocus={betLastEdit}
                  value={betOnPlayer}
                  onFocus={() => {
                    setBetLastEdit(true)
                  }}
                  onChange={(e) => {
                    console.log("writing ", e.target.value)
                    if (e.target.value === "") {
                      setBetOnPlayer(0)
                    } else {
                      setBetOnPlayer(parseInt(e.target.value))
                    }
                    setBetLastEdit(true)
                  }}
                />
              </h3>

              <h3>
                Tip: 
                <InputTextField
                  type='number'
                  fullWidth
                  autoFocus={tipLastEdit}
                  value={tipOnPlayer}
                  onFocus={() => {
                    setTipLastEdit(true)
                  }}
                  onChange={(e) => {
                    console.log("writing ", e.target.value)
                    if (e.target.value === "") {
                      setTipOnPlayer(0)
                    } else {
                      setTipOnPlayer(parseInt(e.target.value))
                    }
                    setTipLastEdit(true)
                  }}
                />
              </h3>
              <h3>
                Total Bet: <span> { parseWBTCBalanceV3(data.p1_total_bet) } </span>
              </h3>
              <div>
                  {<Button 
                    variant="contained" 
                    color="secondary"
                    style={{
                      width: '20px',
                      borderRadius: '10px',
                      justifyContent: 'center',
                      height: '25px'
                    }}
                    onClick={addBetToFightPlayer}
                  >
                    {betState}
                  </Button>}
              </div>
             
            </BetInfoView>
          {/* </ListItemButton> */}



          </ImageAndTextView>
    )
  }

  const Selected_player2_view = (data: IQueueCombined) => {
    return (
          <ImageAndTextView>
          <ImageView>
            <ListItemButton>
              <img
                className='hexagon-icon'
                src={data.p2_profile_image}
                alt="Hero"
              />
              <ListItemText
                primary={
                  <span style={{
                    color: "aliceblue",
                  }}>
                    {data.p2_nick_name}
                  </span>
                } 
                secondary={getEllipsisTxt(data.p2_wallet)} 
              />
            </ListItemButton>
          </ImageView>
          {/* <ListItemButton> */}
            <BetInfoView>
              <h3>
                Your Bet: 
                <InputTextField
                  type='number'
                  fullWidth
                  autoFocus={betLastEdit}
                  value={betOnPlayer}
                  onFocus={() => {
                    setBetLastEdit(true)
                  }}
                  onChange={(e) => {
                    console.log("writing ", e.target.value)
                    if (e.target.value === "") {
                      setBetOnPlayer(0)
                    } else {
                      setBetOnPlayer(parseInt(e.target.value))
                    }
                    setBetLastEdit(true)
                  }}
                />
              </h3>

              <h3>
                Tip: 
                <InputTextField
                  type='number'
                  fullWidth
                  autoFocus={tipLastEdit}
                  value={tipOnPlayer}
                  onFocus={() => {
                    setTipLastEdit(true)
                  }}
                  onChange={(e) => {
                    console.log("writing ", e.target.value)
                    if (e.target.value === "") {
                      setTipOnPlayer(0)
                    } else {
                      setTipOnPlayer(parseInt(e.target.value))
                    }
                    setTipLastEdit(true)
                  }}
                />
              </h3>
              <h3>
                Total Bet: <span> { parseWBTCBalanceV3(data.p2_total_bet) } </span>
              </h3>
              <Button 
                variant="contained" 
                color="secondary"
                style={{
                  width: '20px',
                  borderRadius: '10px',
                  justifyContent: 'center',
                  height: '25px'
                }}
                onClick={addBetToFightPlayer}
              >
                {betState}
              </Button>
            </BetInfoView>
          {/* </ListItemButton> */}

          </ImageAndTextView>
    )
  }

  const Non_selected_player2_view = (data: IQueueCombined) => {
    return (
          <ImageAndTextView>
          <ImageView>
            <ListItemButton>
              <img
                className='hexagon-icon'
                src={data.p2_profile_image}
                alt="Hero"
              />
              <ListItemText
                primary={
                  <span style={{
                    color: "aliceblue",
                  }}>
                    {data.p2_nick_name}
                  </span>
                } 
                secondary={getEllipsisTxt(data.p2_wallet)} 
              />
            </ListItemButton>
          </ImageView>
          {/* <ListItemButton> */}
            <BetInfoView>
              <h3>
                Total Bet: <span> { parseWBTCBalanceV3(data.p2_total_bet) } </span>
              </h3>
              <Button 
                variant="contained" 
                color="secondary"
                style={{
                  width: '20px',
                  borderRadius: '10px',
                  justifyContent: 'center',
                  height: '25px'
                }}
                onClick={() => {
                  setFightIdChosen(data.fight_id)
                  setPlayerChosen(data.p2_wallet)
                }}
              >
                Bet
              </Button>
            </BetInfoView>
          {/* </ListItemButton> */}

          </ImageAndTextView>
    )
  }

  const VsImageView = <ListItemButton 
                    style={{
                      display: "flex",
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <img
                      src="/bitfgihter_assets/VS.png"
                      style={{
                        height: '50px',
                        width: '100%',
                      }}
                      alt="Hero"
                    />
                  </ListItemButton>

  // const ItemView = [];
  const FirstPlayerView: JSX.Element[] = [];
  const SecondPlayerView: JSX.Element[] = [];
  // const PlayerNotChosenView = [];
  combinedQueueData.map((data: IQueueCombined, index) => {
    const tempQueueDetailInfo = queueDetailsInfo[data.fight_id]
    console.log("LoopAllFightsAndUpdate--0-", tempQueueDetailInfo)
    let p1_total_bet = 0;
    let p2_total_bet = 0;
    if (!isNullOrUndefined(tempQueueDetailInfo)) {
      p1_total_bet = tempQueueDetailInfo.total_bet_p1? tempQueueDetailInfo.total_bet_p1: 0;
      p2_total_bet = tempQueueDetailInfo.total_bet_p2? tempQueueDetailInfo.total_bet_p2: 0;
    }
    console.log("LoopAllFightsAndUpdate--0-", p1_total_bet, p2_total_bet)
    
    // const p1_total_bet = 0;
    // const p2_total_bet = 0;
    let TempP1HTML = <></>;
    let TempP2HTML = <></>;
    // let combinedView = <></>;
    if (data.fight_id === fightIdChosen) {
      if (data.p1_wallet === playerChosen) {
        // change the html
        TempP1HTML = <Selected_player1_view 
          fight_id={data.fight_id} 
          p1_wallet={data.p1_wallet} 
          p2_wallet={data.p2_wallet} 
          p1_nick_name={data.p1_nick_name} 
          p2_nick_name={data.p2_nick_name} 
          p1_profile_image={data.p1_profile_image} 
          p2_profile_image={data.p2_profile_image} 
          p1_total_bet={p1_total_bet} 
          p2_total_bet={p2_total_bet} 
          total_bet={data.total_bet} 
        />
      } else {
        TempP1HTML = 
        <Non_selected_player1_view 
          fight_id={data.fight_id} 
          p1_wallet={data.p1_wallet} 
          p2_wallet={data.p2_wallet} 
          p1_nick_name={data.p1_nick_name} 
          p2_nick_name={data.p2_nick_name} 
          p1_profile_image={data.p1_profile_image} 
          p2_profile_image={data.p2_profile_image} 
          p1_total_bet={p1_total_bet} 
          p2_total_bet={p2_total_bet} 
          total_bet={data.total_bet} 
        />
      }
      if (data.p2_wallet === playerChosen) {
        // change the html
        TempP2HTML = <Selected_player2_view 
          fight_id={data.fight_id} 
          p1_wallet={data.p1_wallet} 
          p2_wallet={data.p2_wallet} 
          p1_nick_name={data.p1_nick_name} 
          p2_nick_name={data.p2_nick_name} 
          p1_profile_image={data.p1_profile_image} 
          p2_profile_image={data.p2_profile_image} 
          p1_total_bet={p1_total_bet} 
          p2_total_bet={p2_total_bet} 
          total_bet={data.total_bet} 
        />
      } else {
        TempP2HTML = <Non_selected_player2_view 
          fight_id={data.fight_id} 
          p1_wallet={data.p1_wallet} 
          p2_wallet={data.p2_wallet} 
          p1_nick_name={data.p1_nick_name} 
          p2_nick_name={data.p2_nick_name} 
          p1_profile_image={data.p1_profile_image} 
          p2_profile_image={data.p2_profile_image} 
          p1_total_bet={p1_total_bet} 
          p2_total_bet={p2_total_bet} 
          total_bet={data.total_bet} 
        />
      }
    } 
    else {
      // if none is chosen
      TempP1HTML = 
        <Non_selected_player1_view 
          fight_id={data.fight_id} 
          p1_wallet={data.p1_wallet} 
          p2_wallet={data.p2_wallet} 
          p1_nick_name={data.p1_nick_name} 
          p2_nick_name={data.p2_nick_name} 
          p1_profile_image={data.p1_profile_image} 
          p2_profile_image={data.p2_profile_image} 
          p1_total_bet={p1_total_bet} 
          p2_total_bet={p2_total_bet} 
          total_bet={data.total_bet} 
        />
      TempP2HTML = <Non_selected_player2_view 
          fight_id={data.fight_id} 
          p1_wallet={data.p1_wallet} 
          p2_wallet={data.p2_wallet} 
          p1_nick_name={data.p1_nick_name} 
          p2_nick_name={data.p2_nick_name} 
          p1_profile_image={data.p1_profile_image} 
          p2_profile_image={data.p2_profile_image} 
          p1_total_bet={p1_total_bet} 
          p2_total_bet={p2_total_bet} 
          total_bet={data.total_bet} 
        />
    }
    FirstPlayerView.push(TempP1HTML)
    SecondPlayerView.push(TempP2HTML)
  })

  return (
    <div>
        <List>
        {
          !isNullOrUndefined(combinedQueueData) && combinedQueueData.length > 0 &&
          combinedQueueData.map((data: IQueueCombined, index) => {
            return (
              <BackDrop>
                <ListItem disablePadding key={uuidv4()}>
                  <ListItemViews>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={0}>
                        <Grid item xs={1} style={{
                            display: 'flex',
                            padding: '10px',
                            alignItems: 'center'
                          }}>
                            <h1 style={{color: 'aliceblue' }}> {index + 1} </h1>
                        </Grid>
                        <Grid item xs={4.5} style={{
                          // backgroundColor: 'yellow'
                        }}>
                          {
                            FirstPlayerView[index]
                          }
                        </Grid>
                        <Grid item xs={2} style={{
                          // backgroundColor: 'red',
                          alignItems: 'center',
                          display: 'flex'
                        }}>
                          { VsImageView }
                        </Grid>
                        <Grid item xs={4.5} style={{
                          // backgroundColor: 'yellow'
                        }}>
                          {
                            SecondPlayerView[index]
                          }
                        </Grid>
                      </Grid>
                    </Box>
                  </ListItemViews>

                  {
                    (data.p1_wallet === store.getState().web3store.userAddress || data.p2_wallet === store.getState().web3store.userAddress) ?
                    <CloseIcon
                      style={{
                        color: 'red'
                      }} 
                      onClick={() => {
                        // remove your self from queue
                        console.log("pressed close icon")
                        deleteUserFromQueue()
                      }}
                    />
                    :<></>
                  }

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