import { createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "..";

interface IinitialState {
  email: string;
  merchantId: string;
  accessToken: string;
}

const initialState: IinitialState = {
  email: "",
  merchantId: "",
  accessToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state) => {
      return state;
    },
  },
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;

const auth = ({ auth }: RootState) => auth;

export const authSelector = createSelector([auth], (auth) => auth);
