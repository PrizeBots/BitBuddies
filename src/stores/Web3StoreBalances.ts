import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AssetsInterface } from '../utils/interface';


interface Web3BalanceStore {
  wbtcBalance: string,
  walletBalance: string,
  betBalance: string,
  decimals: string,

  // assets
  assetsInfo: Array<AssetsInterface>,

  web2CreditBalance: number,

  changeInBalance: string,
  changeBalanceShowBool: boolean,
}

const initialState: Web3BalanceStore = {
  wbtcBalance: "",
  walletBalance: "",
  betBalance: "",
  decimals: "",

  // assets
  assetsInfo: [],

  web2CreditBalance: 0,

  changeInBalance: '',
  changeBalanceShowBool: false
}

export const web3StoreBalance = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    SetWbtcBalance: (state: { wbtcBalance: string; },  action: PayloadAction<string>) => {
      state.wbtcBalance = action.payload;
    },

    SetWalletBalance: (state: { walletBalance: string; },  action: PayloadAction<string>) => {
      state.walletBalance = action.payload;
    },

    SetBetBalance: (state: { betBalance: string; },  action: PayloadAction<string>) => {
      state.betBalance = action.payload;
    },

    SetDecimals: (state: { decimals: string; },  action: PayloadAction<string>) => {
      state.decimals = action.payload;
    },

    SetAssetsInfo: (state: { assetsInfo: Array<AssetsInterface>; },  action: PayloadAction<Array<AssetsInterface>>) => {
      state.assetsInfo = action.payload;
    },

    SetWeb2CreditBalance: (state: { web2CreditBalance: number; },  action: PayloadAction<number>) => {
      state.web2CreditBalance = action.payload;
    },

    SetChangeInBalanceBool: (state: { changeBalanceShowBool: boolean; },  action: PayloadAction<boolean>) => {
      state.changeBalanceShowBool = action.payload;
    },

    SetChangeInBalance: (state: { changeInBalance: string; },  action: PayloadAction<string>) => {
      state.changeInBalance = action.payload;
    },
  },
})

export const { SetWbtcBalance, SetWalletBalance, SetBetBalance, 
  SetDecimals, SetAssetsInfo, SetWeb2CreditBalance, SetChangeInBalance, SetChangeInBalanceBool } = web3StoreBalance.actions

export default web3StoreBalance.reducer
