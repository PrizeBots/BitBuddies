import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface BitFightersCollection {
  value: Array<string>
  nftData: Array<any>
  loaded: boolean
  totalNFTData: Array<any>
  preSaleNFTMintedCount: number,
  oneKClubMintedCards: number;
}

const initialState: BitFightersCollection = {
  value: [],
  nftData: [],
  loaded: false,
  totalNFTData: [],
  preSaleNFTMintedCount: 0,
  oneKClubMintedCards: 0
}

export const bitFightersCollection = createSlice({
  name: 'bitFightersCollection',
  initialState,
  reducers: {
    addIntoArray: (state: { value: Array<string>; }, action: PayloadAction<string>) => {
      state.value.push(action.payload);
    },
    clearArray: (state: { value: Array<string>; }) => {
      state.value = [];
    },
    setArray: (state: { value: Array<string>; }, action: PayloadAction<Array<string>>) => {
      // console.log("adding into set array -->", action.payload)
      state.value = action.payload;
    },
    setNFTDetails: (state: { nftData: Array<any>; }, action: PayloadAction<Array<any>>) => {
      // console.log("setting into set array -->", action.payload)
      state.nftData = action.payload;
    },

    setTotalNFTData: (state: { totalNFTData: Array<any>; }, action: PayloadAction<Array<any>>) => {
      state.totalNFTData = action.payload;
    },

    setNFTLoadedBool: (state: { loaded: boolean; }, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },

    SetTotalPreSaleNFT: (state: { preSaleNFTMintedCount: number; }, action: PayloadAction<number>) => {
      state.preSaleNFTMintedCount = action.payload;
    },

    SetTotalOneKClubNF: (state: { oneKClubMintedCards: number; }, action: PayloadAction<number>) => {
      state.oneKClubMintedCards = action.payload;
    },
  },
})

export const { addIntoArray, clearArray, setArray, setNFTDetails, setNFTLoadedBool, setTotalNFTData, SetTotalPreSaleNFT, SetTotalOneKClubNF } =
  bitFightersCollection.actions

export default bitFightersCollection.reducer
