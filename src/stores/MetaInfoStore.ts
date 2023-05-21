import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface IMetaInfoStore {
  net_speed: string;
}

const initialState: IMetaInfoStore = {
  net_speed: ""
}

export const metaInfoStore = createSlice({
  name: 'metaInfoStore',
  initialState,
  reducers: {
    SetServerLatency: (state: { net_speed: string; }, action: PayloadAction<string>) => {
      state.net_speed = action.payload;
    },
  },
})

export const { SetServerLatency } =
  metaInfoStore.actions

export default metaInfoStore.reducer
