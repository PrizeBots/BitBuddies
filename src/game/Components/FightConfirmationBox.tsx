import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box, Button } from "@mui/material"
import { ShowFightConfirmationBox, TurnMouseClickOff } from "../../stores/UserActions";
import phaserGame from "../../PhaserGame";
import Bootstrap from "../scenes/Bootstrap";
import Game from "../scenes/Game";
import store from "../../stores";

const Backdrop = styled.div`
  position: fixed;
  top: 40%;
  left: 30%;
  max-height: 35%;
  height: 35%;
  width: 35%;
  z-index: 1;
`

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
`

const FightConfirmationBoxDiv = styled(Box)`
  width: 100%;
  overflow: auto;
  opacity: 1;
  background: #000000a7;
  border: 5px solid #000000;
  border-radius: 10px;
  padding: 30px;

  h2 {
    font-family: Monospace;
    font-style: bold;
    font-size: 25px;
    color: white;
    margin-top: 10px;
  }

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 21px;
  }
`

export function FightConfirmationBox() {
  const gotFightConfirmationMessage = useAppSelector((state) => state.userActionsDataStore.showFightConfirmationBox)
  const gotFightConfirmationTime = useAppSelector((state) => state.userActionsDataStore.showFightConfirmationTime)
  // const friendsDetails = useAppSelector((state) => state.userPathStore.User_Data)
  // const PlayerSelectedInfo = useAppSelector((state) => state.playerDataStore.player_selected_all_info)
  // const [buttonLoading, setButtonLoading] = useState(false);
  // const dispatch = useAppDispatch();
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  const game = phaserGame.scene.keys.game as Game;

  const acceptFightRequest = async() => {
    console.log("accept fight request..")
    game.lobbySocketConnection.send(JSON.stringify({
      event: "fight_confirmation_accepted",
      walletAddress: store.getState().web3store.userAddress,
    }))
    bootstrap.play_err_sound()
    store.dispatch(ShowFightConfirmationBox(false))
  }

  const cancelFightRequest = async() => {
    store.dispatch(ShowFightConfirmationBox(false))
  }
  // const ref = useDetectClickOutside({ onTriggered: data.closeFunction });
  const dispatch = useAppDispatch()

  return(
    <div>
      {
        gotFightConfirmationMessage && 
        <div>
          <Backdrop >
            <Wrapper
              onMouseOver={() => {
                // console.log(" mouse over .. in add to queuebox ")
                dispatch(TurnMouseClickOff(true))
              }}
              onMouseOut={() =>{ 
                // console.log(" mouse out in add to queue box")
                dispatch(TurnMouseClickOff(false))
              }}
            >
              <FightConfirmationBoxDiv>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around'
                }}>
                  <div>
                    <h2>
                      It's your turn to play!
                    </h2>
                    {/* <span style={{
                      color: 'aliceblue',
                    }}>
                      (This pop-up will only be visible for 10 seconds.)
                    </span> */}
                  </div>

                  <div style={{
                    // flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingTop: '10px',
                    // width: '50px',
                    // backgroundColor: 'aliceblue'
                  }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() =>  {
                        dispatch(TurnMouseClickOff(false))
                        acceptFightRequest()
                      } }
                    >
                      <span style={{
                          color: 'aliceblue'
                        }}>Ready!</span>
                    </Button>
                    {/* <Button 
                      variant="contained" 
                      color="error"
                      onClick={() => cancelFightRequest()}
                    >
                      No
                    </Button> */}
                  </div>
                  <h2 style={{
                    marginTop: '10px'
                  }}>
                    {gotFightConfirmationTime}
                  </h2>
                </div>

              </FightConfirmationBoxDiv>
            </Wrapper>
          </Backdrop>
        </div>
      }
    </div>
  )
}