import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageStates } from "../landing-page/components/SidePanel/SidePanel";
// import { RootState } from ".";

// interface MintCardState {
//   cardType: "big_info" | "small_info" | "sold_out";
// }

interface MintCardState {
  state_selected: string;
}

const initialState: MintCardState = {
  state_selected: PageStates.NotConnectedState,
};

export const MintCardStateSlice = createSlice({
  name: "mintCardState",
  initialState,
  reducers: {
    setCardState: (state: { state_selected: string; }, action: PayloadAction<string>) => {
      // console.log("sidepanel clicked.. ", action.payload)
      state.state_selected = action.payload;
    },
  },
});

export const { setCardState } = MintCardStateSlice.actions;

// export const selectMintCardState = (state: RootState) =>
//   state.mintCardStateStore.cardType;

export default MintCardStateSlice.reducer;
