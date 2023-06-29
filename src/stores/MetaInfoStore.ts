import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface IMetaInfoStore {
  net_speed: string;
  meta_tag_description: string;
}

const initialState: IMetaInfoStore = {
  net_speed: "",
  meta_tag_description: "",
}

export const metaInfoStore = createSlice({
  name: 'metaInfoStore',
  initialState,
  reducers: {
    SetServerLatency: (state: { net_speed: string; }, action: PayloadAction<string>) => {
      state.net_speed = action.payload;
    },

    SetMetaTagDescription: (state: { meta_tag_description: string; }, action: PayloadAction<string>) => {
      state.meta_tag_description = action.payload;
    },



  },
})

export const { SetServerLatency, SetMetaTagDescription } =
  metaInfoStore.actions

export default metaInfoStore.reducer
