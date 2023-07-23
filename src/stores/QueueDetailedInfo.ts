import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { QueueSingleEntry } from '../utils/interface';


interface QueueDetaildInfo {
  queue_to_fight_info_map: any;

  added_to_queue_pool: boolean;
  queuePoolMessage: string;
}

const initialState: QueueDetaildInfo = {
  queue_to_fight_info_map: {},

  added_to_queue_pool: false,
  queuePoolMessage: ""
}

export const queueInfoStore = createSlice({
  name: 'queueInfoStore',
  initialState,
  reducers: {

    SetFightEntryInfo: (state: { queue_to_fight_info_map: any; }, action: PayloadAction<any>) => {
      state.queue_to_fight_info_map = action.payload;
    },

    SetQueuePoolState: (state: { added_to_queue_pool: boolean; }, action: PayloadAction<boolean>) => {
      state.added_to_queue_pool = action.payload;
    },

  },
})

export const { SetFightEntryInfo, SetQueuePoolState } =
  queueInfoStore.actions

export default queueInfoStore.reducer
