import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface PlayersData {
  nick_name: string,
  info_button_clicked: boolean,
  player_selected_all_info: any,
  current_game_player_info: any,

  gameStarted: boolean;
}

const initialState: PlayersData = {
  nick_name : "",
  info_button_clicked: false,
  player_selected_all_info: {},
  current_game_player_info: {},

  gameStarted: false,
}

export const playerDataCollection = createSlice({
  name: 'playerDataCollection',
  initialState,
  reducers: {
    setNickName: (state: { nick_name: string; }, action: PayloadAction<string>) => {
      state.nick_name = action.payload;
    },
    setInfoButtonClicked: (state: { info_button_clicked: boolean; }, action: PayloadAction<boolean>) => {
      console.log("info buitton clicked.. ")
      state.info_button_clicked = action.payload;
    },
    SetPlayerSelected: (state: { player_selected_all_info: any; }, action: PayloadAction<any>) => {
      state.player_selected_all_info = action.payload;
    },

    SetCurrentGamePlayer: (state: { current_game_player_info: any; }, action: PayloadAction<any>) => {
      state.current_game_player_info = action.payload;
    },

    SetGameStarted: (state: { gameStarted: boolean; }, action: PayloadAction<boolean>) => {
      state.gameStarted = action.payload;
    },
    // clearPlayerSelected: (state: { info_button_clicked: boolean; }, action: PayloadAction<boolean>) => {
    //   state.info_button_clicked = action.payload;
    // },
  },
})

export const { setNickName, setInfoButtonClicked, SetPlayerSelected, SetCurrentGamePlayer, SetGameStarted } =
  playerDataCollection.actions

export default playerDataCollection.reducer
