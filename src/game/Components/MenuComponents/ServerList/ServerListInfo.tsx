import { Box, Button, Grid, List, ListItemButton, ListItemText } from '@mui/material'
import { useAppSelector } from '../../../../hooks'
import './ServerListInfo.css'
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { getEllipsisTxt } from '../../../../utils';
import { FetchGameServerConnection } from '../../../../utils/game_server_utils';
import store from '../../../../stores';
import { SetGameLoadingState, SetSelectedRoomId, SetShowGameServersList } from '../../../../stores/WebsiteStateStore';
import { SetGameStarted } from '../../../../stores/PlayerData';
import Bootstrap from '../../../scenes/Bootstrap';
import phaserGame from '../../../../PhaserGame';
import { WaveLoader } from '../../../../landing-page/components/WaveLoader/WaveLoader';

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

const MyDivider = styled.div`
  border: 1px solid #000000;
  margin-bottom: 10px;
`;

export function ServerListInfo() {
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const gameServersInfo = useAppSelector((state) => state.websiteStateStore.serversInfo)
  console.log("game servers info --", gameServersInfo)

  const fetchServerUrlAndConnect = async (room_id: string) => {
    //
    console.log(room_id)
    await FetchGameServerConnection( room_id )
    store.dispatch(SetSelectedRoomId(room_id))

    startGame()
  }

  const startGame = async () => {
    // event.preventDefault();
    store.dispatch(SetGameStarted(true));
    store.dispatch(SetGameLoadingState(true));
    bootstrap.launchGame(store.getState().playerDataStore.current_game_player_info)
    store.dispatch(SetShowGameServersList(false));
    
  }

  return(
    <div>
      <List>
      {
        gameServersInfo.length ? 
        gameServersInfo.map((serverinfo, index) => {
          return(
            <Box sx={{ flexGrow: 1 }} key={uuidv4()}>
              <ListItemButton key={uuidv4()}>
              <Grid container spacing={0}>
                <Grid item xs={1} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start'
                  }}>
                    <h3 style={{color: 'aliceblue' }}> {index + 1} </h3>
                </Grid>
                <Grid item xs={8} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ListItemText
                    primary={
                      <span style={{
                        color: "aliceblue",
                      }}>
                        {`active - ${serverinfo.active_users}/ 100`}
                      </span>
                    } 
                    secondary={getEllipsisTxt(serverinfo.room_id)}
                  />
        
                </Grid>
                <Grid item xs={3} style={{
                  alignItems: 'center',
                  display: 'flex'
                }}>
                  
                  <ButtonView variant="contained" onClick={() => {
                    fetchServerUrlAndConnect(serverinfo.room_id)
                  }}>
                    <span>
                      Connect
                    </span>
                  </ButtonView>
                </Grid>
              </Grid>
              
              </ListItemButton>
              <MyDivider></MyDivider>
            </Box>
          )
        }):
        <div>

          <WaveLoader />
        </div>

      }
      </List>
    </div>
  )
}
