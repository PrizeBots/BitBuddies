import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ServersInfo {
  room_id: string,
  active_users: string,
  total_users: string,
  region: string,
}

export interface LeaderBoardData {
  user_wallet_address: string,
  web2_balance: number,
  num_fights: number,
}

interface IWebsiteStateStore {
  gameLoading: boolean;
  showGameServersList: boolean;
  serversInfo: Array<ServersInfo>;
  selected_roomId: string,
  selected_server_url: string,
  region: string,
  leaderboardOpen: boolean,
  leaderboardData: Array<LeaderBoardData>,
}

const initialState: IWebsiteStateStore = {
  gameLoading: false,
  showGameServersList: false,
  serversInfo: [],
  selected_roomId: "",
  selected_server_url: "",
  region: "Washington_DC",
  leaderboardOpen: false,
  leaderboardData: [],
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

    SetLeaderBoardData: (state: { leaderboardData: Array<LeaderBoardData>; }, action: PayloadAction<Array<LeaderBoardData>>) => {
      state.leaderboardData = action.payload;
    },
  },
})

export const { SetGameLoadingState, SetShowGameServersList, 
  SetSelectedRegionofGameServer,
  SetGameServersData, SetSelectedRoomId, SetSelectedGameServerURL, SetLeaderBoardOpen, SetLeaderBoardData } =
  websiteStateInfoStore.actions

export default websiteStateInfoStore.reducer
