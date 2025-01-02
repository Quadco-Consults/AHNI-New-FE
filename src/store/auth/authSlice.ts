import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "..";
import { LoginData } from "definations/auth/auth";

const initialState: LoginData = {
    access_token: "",

    refresh_token: "",
    user: {
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        last_login: "",
        roles: [],
        permissions: [],
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, { payload }: PayloadAction<LoginData>) => {
            return {
                ...state,
                ...payload,
            };
        },
        logOut: () => {
            return {
                ...initialState,
            };
        },
    },
});

export const { setAuth, logOut } = authSlice.actions;

export default authSlice.reducer;

const auth = ({ auth }: RootState) => auth;

export const authSelector = createSelector([auth], (auth) => auth);
