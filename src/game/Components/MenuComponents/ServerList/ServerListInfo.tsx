import { Box, Button, FormControl, Grid, InputLabel, List, ListItemButton, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useAppSelector } from '../../../../hooks'
import './ServerListInfo.css'
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { getEllipsisTxt } from '../../../../utils';
import { FetchGameServerConnection, ListGameServers } from '../../../../utils/game_server_utils';
import store from '../../../../stores';
import { SetGameLoadingState, SetGameServersData, SetSelectedRegionofGameServer, SetSelectedRoomId, SetShowGameServersList } from '../../../../stores/WebsiteStateStore';
import { SetGameStarted } from '../../../../stores/PlayerData';
import Bootstrap from '../../../scenes/Bootstrap';
import phaserGame from '../../../../PhaserGame';
import { WaveLoader } from '../../../../landing-page/components/WaveLoader/WaveLoader';
import { useState } from 'react';
import { isNullOrUndefined } from 'util';

const ButtonView = styled(Button)`
  span {
    color: black;
    font-style: bold;
    font-size: 15px;
    font-family:'Cooper Black', sans-serif;
  }

  background-color: #9c341a;

  &:hover {
    background-color: #852d17;
  }

  width: 200px;
  height: 50px;
`;

const BoxWrapper = styled(Box)`
  span {
    color: aliceblue;
    font-style: bold;
    font-size: 20px;
    font-family:'Cooper Black', sans-serif;
  }

  p {
    color: #808080;
  }
`;

const MyDivider = styled.div`
  border: 1px solid #000000;
  margin-bottom: 10px;
`;

const CenterText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    color: aliceblue;
    font-style: bold;
    font-size: 20px;
    font-family:'Cooper Black', sans-serif;
    justify-content: center;
    align-items: center;
  }
`

export function ServerListInfo() {
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const gameServersInfo = useAppSelector((state) => state.websiteStateStore.serversInfo)

  const selectedPlayer = useAppSelector(
    (state) => state.playerDataStore.current_game_player_info
  );

  const gameServerReginoSelected = useAppSelector((state) => state.websiteStateStore.region)

  // console.log("-=-- selected_player---", selectedPlayer)
  // const [game_server, set_game_server ]= useState("Washington_DC")
  console.log("game servers info --", gameServersInfo)

  const SelectGameServerAndLoadInfo = async (region: string) => {
    store.dispatch(SetGameServersData([]));
    ListGameServers(region)
    console.log("in SelectGameServerAndLoadInfo", region)
    store.dispatch(SetSelectedRegionofGameServer(region))
    // set_game_server(region);
  }

  const fetchServerUrlAndConnect = async (room_id: string) => {
    console.log(room_id)
    await FetchGameServerConnection( room_id )
    store.dispatch(SetSelectedRoomId(room_id))
    startGame()
  }

  const startGame = async () => {
    // event.preventDefault();
    store.dispatch(SetGameStarted(true));
    localStorage.setItem("game_state", "start")
    store.dispatch(SetGameLoadingState(true));
    bootstrap.launchGame(store.getState().playerDataStore.current_game_player_info)
    store.dispatch(SetShowGameServersList(false));
    store.dispatch(SetShowGameServersList(false));
  }

  return(
    <div>
      <List>
      
            <BoxWrapper sx={{ flexGrow: 1 }} key={uuidv4()}>
              <FormControl fullWidth style={{
                alignItems: 'center',
                paddingBottom: '20px',
                paddingTop: '20px',
              }}>
                <span>World Servers</span>
                <p> Please connect to your nearest world server for best experience</p>
                <Select
                  id="demo-simple-select"
                  value={gameServerReginoSelected}
                  onChange={(event: SelectChangeEvent) => {
                    SelectGameServerAndLoadInfo(event.target.value as string)
                  }}
                  style={{
                    width: '300px',
                  }}
                >
                  <MenuItem value={"Washington_DC"}>US-East</MenuItem>
                  <MenuItem value={"Mumbai"}>India</MenuItem>
                </Select>
              </FormControl>
              {
                gameServersInfo && gameServersInfo.length > 0 ? 
                  gameServersInfo.map((serverinfo, index) => {
                    return(
                      <>
                        <ListItemButton key={uuidv4()}>
                          <Grid container spacing={0}>
                            <Grid item xs={1} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'start'
                              }}>
                                <h3 style={{color: 'aliceblue', fontSize: '20px' }} className="cooper-black-tab" > {index + 1} </h3>
                            </Grid>
                            <Grid item xs={7} style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <ListItemText
                                primary={
                                  <span style={{
                                    color: "aliceblue",
                                  }}>
                                    {`${getServerNameForDisplay(serverinfo.region)} - ${serverinfo.active_users}/ 100`}
                                  </span>
                                } 
                                secondary={getEllipsisTxt(serverinfo.room_id)}
                              />
                    
                            </Grid>
                            <Grid item xs={4} style={{
                              alignItems: 'center',
                              display: 'flex'
                            }}>
                              
                              <ButtonView 
                                variant="contained" 
                                onClick={() => {
                                  fetchServerUrlAndConnect(serverinfo.room_id)
                                }}
                                disabled={selectedPlayer.nick_name === ""}
                              >
                                {
                                  selectedPlayer.nick_name === ""?
                                  <span>

                                  </span>:
                                  <span>
                                    Connect
                                  </span>
                                }
                              </ButtonView>
                            </Grid>
                          </Grid>
                        
                        </ListItemButton>
                        <MyDivider></MyDivider>
                      </>
                    )
                  }):
                (Object.keys(selectedPlayer).length > 0)?
                  <div>
                    <WaveLoader />
                  </div>:
                <CenterText>
                  <span>
                    Choose a Player to load servers
                  </span>
                </CenterText>
              } 
              
            </BoxWrapper>
          

      </List>
    </div>
  )
}

function getServerNameForDisplay(region: string) {
  if (region === "Washington_DC" ) {
    return "US_East"
  }
  if (region === "Mumbai" ) {
    return "India"
  }
}
