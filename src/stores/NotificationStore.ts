import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface NotificationStore {
  successNotificationBool: boolean,
  successNotificationMessage: string,

  failureNotificationBool: boolean,
  failureNotificationMessage: string
}

const initialState: NotificationStore = {
  successNotificationBool: false,
  successNotificationMessage: "",
  failureNotificationBool: false,
  failureNotificationMessage: ""
}

export const NotificationStore = createSlice({
  name: 'notification_store',
  initialState,
  reducers: {

    SetSuccessNotificationBool: (state: { successNotificationBool: boolean; },  action: PayloadAction<boolean>) => {
      state.successNotificationBool = action.payload;
    },

    SetFailureNotificationBool: (state: { failureNotificationBool: boolean; },  action: PayloadAction<boolean>) => {
      state.failureNotificationBool = action.payload;
    },

    SetFailureNotificationMessage: (state: { failureNotificationMessage: string; },  action: PayloadAction<string>) => {
      state.failureNotificationMessage = action.payload;
    },

    SetSuccessNotificationMessage: (state: { successNotificationMessage: string; },  action: PayloadAction<string>) => {
      state.successNotificationMessage = action.payload;
    },
  },
})

export const { SetFailureNotificationBool, SetFailureNotificationMessage, SetSuccessNotificationBool, SetSuccessNotificationMessage } = NotificationStore.actions

export default NotificationStore.reducer
