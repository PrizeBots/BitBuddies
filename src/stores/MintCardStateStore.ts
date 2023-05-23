import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

interface MintCardState {
  cardType: "big_info" | "small_info" | "sold_out";
}

const initialState: MintCardState = {
  cardType: "big_info",
};

export const MintCardStateSlice = createSlice({
  name: "mintCardState",
  initialState,
  reducers: {
    setCardState: (state, action: PayloadAction<MintCardState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setCardState } = MintCardStateSlice.actions;

export const selectMintCardState = (state: RootState) =>
  state.mintCardStateStore.cardType;

export default MintCardStateSlice.reducer;
