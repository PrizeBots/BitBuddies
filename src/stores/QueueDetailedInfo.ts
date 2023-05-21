import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { QueueSingleEntry } from '../utils/interface';


interface QueueDetaildInfo {
  queue_to_fight_info_map: any;
}

const initialState: QueueDetaildInfo = {
  queue_to_fight_info_map: {}
}

export const queueInfoStore = createSlice({
  name: 'queueInfoStore',
  initialState,
  reducers: {

    SetFightEntryInfo: (state: { queue_to_fight_info_map: any; }, action: PayloadAction<any>) => {
      state.queue_to_fight_info_map = action.payload;
    },

  },
})

export const { SetFightEntryInfo } =
  queueInfoStore.actions

export default queueInfoStore.reducer
