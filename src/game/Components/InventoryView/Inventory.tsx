import { Box, Button, Grid } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from "../../../hooks";
import Game from "../../scenes/Game";
import phaserGame from "../../../PhaserGame";
import store from "../../../stores";
import { useAssetsApi } from "../../../hooks/ApiCaller";
import { SetFailureNotificationBool, SetFailureNotificationMessage, SetSuccessNotificationBool, SetSuccessNotificationMessage } from "../../../stores/NotificationStore";
import { SetEquippedBrewCount } from "../../../stores/AssetStore";

// const Item = styled(Paper)(({ theme }) => ({
//   // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   backgroundColor:  '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: '#1A2027',
// }));


const Item = styled.div`
  overflow: auto;
  background: #DFEEFC;
  border: 1px solid #000000;
  margin: auto;
  padding: 5px;

  span {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
  }

  h2, h3 {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 25px;
    color: black;
    padding-bottom: 10px;
  }

`

const ButtonGroupView = styled.div`
  background: #DFEEFC;
  border: 1px solid #000000;

  button {
    width: 100px;
    background-color: #4797df;
    color: aliceblue;
  }
`

export function Inventory() {
  const [showButtonGroupBool, setShowButtonGroupBool] = useState(false);
  // const assetsInfo = useAppSelector((state) => state.web3BalanceStore.assetsInfo)
  const assetsInfo = useAppSelector((state) => state.assetStore.assets)
  const game = phaserGame.scene.keys.game as Game;
  // console.log(" in inventory -- ", assetsInfo)
  // const numberOfBrews = 
  // let showButtonGroupIndexArray: Array<boolean> = [];
  

  const numberOfRows = 3;
  const numberOfColumns = 3;
  // const numberOfBrew = 2;
  const brewArr = [];
  const nonBrewArrMap: any[] = [];
  const emptyArray = [];
  for(let i = 0 ; i< assetsInfo.length; i++) {
    const tempAsset = assetsInfo[i]
    for (let j = 0; j < tempAsset.active_assets; j++) {
      brewArr.push(0)
    }
  }
  for (let i = 0; i < 9 - (brewArr.length + nonBrewArrMap.length); i++) {
    emptyArray.push(0)
  }

  async function useBrew() {
    const res = await useAssetsApi("brew")
    if (res) {
      // const otherPlayer = game.otherPlayers.get(store.getState().web3store.player_id)
      // if (otherPlayer?.gameObject) {
      //   // otherPlayer.drinkStarted = true
      //   // otherPlayer.drinking = false
      // }
      setTimeout(() => {
        game.lobbySocketConnection.send(JSON.stringify({
          event: "brew_used",
          walletAddress: store.getState().web3store.userAddress,
        }));

        // store.dispatch(SetSuccessNotificationBool(true))
        // store.dispatch(SetSuccessNotificationMessage("Successfully Used."))
        // bootstrap.play_err_sound()
      }, 1000);
    }  else {
      setTimeout(() => {
        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage("Failed to use Brew"))
      }, 300);
    }
  }

  async function equipBrew() {
    console.log("equip brew...")
    if (store.getState().assetStore.equippedBrewCount > 0) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Not Allowed"))
    } else {
      const res = await useAssetsApi("brew")
      if (res) {
        store.dispatch(SetEquippedBrewCount(1))
      } else {
        setTimeout(() => {
          store.dispatch(SetFailureNotificationBool(true))
          store.dispatch(SetFailureNotificationMessage("Failed to Equip Brew"))
        }, 300);
      }
    }
  }

  let buttonGroupView = <></>;
  buttonGroupView = <ButtonGroupView>
      <Box sx={{ flexGrow: 1 }} 
        style={{
          // opacity: 0.8,
          padding: '10px',
        }}
      >
        <Grid container spacing={0} key={uuidv4()} style={{
          padding: '10px'
        }}>
          <Grid item xs={12} key={uuidv4()}>
            <Button 
              variant="contained" 
              color="info" 
              onClick={useBrew}
            > Use </Button>
          </Grid>
        </Grid>

        <Grid container spacing={0} key={uuidv4()} style={{
          padding: '10px'
        }}>
          <Grid item xs={12} key={uuidv4()}>
            <Button 
              variant="contained" 
              color="info"
              onClick={equipBrew}
            >
              Equip 
            </Button>
          </Grid>
        </Grid>
      </Box>
  </ButtonGroupView>

  return(
    <div style={{
      display: 'flex',
      flexDirection: 'row',
    }}>
      <Box sx={{ flexGrow: 1 }} 
        style={{
          width: '210px'
        }}
      >
        <Grid container spacing={0} key={uuidv4()}>
          <Grid item xs={12} key={uuidv4()}>
            <Item>
              <h2> Inventory </h2> 
            </Item>
          </Grid>
          {
            brewArr.map((el, index) => {
              return (
                <>
                  <Grid item xs={4} key={uuidv4()}>
                    <Item key={uuidv4()}>
                      <img 
                        src="bitfgihter_assets/brew/BREW.png" 
                        alt="." 
                        height="35" 
                        width="15"
                        onMouseDown={(el) => {
                          if (el.button === 2) {
                            console.log("right button pressed")
                            setShowButtonGroupBool(true)
                          } else {
                            setShowButtonGroupBool(false)
                          }
                        }}
                        key={uuidv4()}
                      ></img>
                    </Item>
                  </Grid>
                </>
              )
            })
          }

          {
            nonBrewArrMap.map(el => {
              return(
                <>
                  <Grid item xs={4}>
                    <Item>
                      <img 
                        src="bitfgihter_assets/brew/empty-brew.png" 
                        alt="." 
                        height="35" 
                        width="15"
                      ></img>
                    </Item>
                  </Grid>
                </>
              )
            })
          }

          {
            emptyArray.map(el => {
              return(
                <>
                  <Grid item xs={4}>
                    <Item>
                      <img 
                        style={{
                          height: "35",
                          width: "15"
                        }}
                        height="35" 
                        width="15"
                      ></img>
                    </Item>
                  </Grid>
                </>
              )
            })
          }
        </Grid>
      </Box>

      <div 
        style={{
          marginTop: '60px',
          marginLeft: '20px'
        }}
      >
        {
          showButtonGroupBool? <>{buttonGroupView}</>: <></>
        }
      </div>
    </div>
  )
}