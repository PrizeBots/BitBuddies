import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ServersInfo {
  room_id: string,
  active_users: string,
  total_users: string,
  region: string,
}

interface IWebsiteStateStore {
  gameLoading: boolean;
  showGameServersList: boolean;
  serversInfo: Array<ServersInfo>;
  selected_roomId: string,
  selected_server_url: string,
  region: string,
  leaderboardOpen: boolean,
}

const initialState: IWebsiteStateStore = {
  gameLoading: false,
  showGameServersList: false,
  serversInfo: [],
  selected_roomId: "",
  selected_server_url: "",
  region: "Washington_DC",
  leaderboardOpen: false,
}

export const websiteStateInfoStore = createSlice({
  name: 'websiteStateInfoStore',
  initialState,
  reducers: {
    SetGameLoadingState: (state: { gameLoading: boolean; }, action: PayloadAction<boolean>) => {
      state.gameLoading = action.payload;
    },

    SetShowGameServersList: (state: { showGameServersList: boolean; }, action: PayloadAction<boolean>) => {
      state.showGameServersList = action.payload;
    },


    SetGameServersData: (state: { serversInfo: Array<ServersInfo>; }, action: PayloadAction<Array<ServersInfo>>) => {
      console.log("in_setting_game_server_data ", action.payload)
      state.serversInfo = action.payload;
    },

    SetSelectedRoomId: (state: { selected_roomId: string; }, action: PayloadAction<string>) => {
      state.selected_roomId = action.payload;
    },

    SetSelectedGameServerURL: (state: { selected_server_url: string; }, action: PayloadAction<string>) => {
      state.selected_server_url = action.payload;
    },

    SetSelectedRegionofGameServer: (state: { region: string; }, action: PayloadAction<string>) => {
      state.region = action.payload;
    },


    SetLeaderBoardOpen: (state: { leaderboardOpen: boolean; }, action: PayloadAction<boolean>) => {
      state.leaderboardOpen = action.payload;
    },
  },
})

export const { SetGameLoadingState, SetShowGameServersList, 
  SetSelectedRegionofGameServer,
  SetGameServersData, SetSelectedRoomId, SetSelectedGameServerURL, SetLeaderBoardOpen } =
  websiteStateInfoStore.actions

export default websiteStateInfoStore.reducer
