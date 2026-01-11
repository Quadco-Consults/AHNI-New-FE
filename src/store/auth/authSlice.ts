import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "..";
import { ILoginData } from "@/features/auth/types/auth";

const initialState: ILoginData = {
    access_token: "",
    refresh_token: "",
    isAuthenticated: false,
    loading: false,
    user: {
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        last_login: "",
        roles: [],
        permissions: [],
    },
    permissions: [],
    roles: [],
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, { payload }: PayloadAction<ILoginData>) => {
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
            };
        },
        setLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.loading = payload;
        },
        logOut: () => {
            return {
                ...initialState,
            };
        },
    },
});

export const { setAuth, setLoading, logOut } = authSlice.actions;

export default authSlice.reducer;

const auth = ({ auth }: RootState) => auth;

export const authSelector = createSelector([auth], (auth) => ({ ...auth }));
