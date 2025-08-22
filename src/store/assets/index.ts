import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { TUser } from "features/auth/types/user";

interface AssetsState {
    assets: string[];
    users: TUser[];
}

const initialState: AssetsState = {
    assets: [],
    users: [],
};

const assetsSlice = createSlice({
    name: "assets",
    initialState,
    reducers: {
        addAsset: (state, action: PayloadAction<string>) => {
            state.assets.push(action.payload);
        },
        removeAsset: (state, action: PayloadAction<string>) => {
            state.assets = state.assets.filter(
                (asset) => asset !== action.payload
            );
        },
        clearAssets: (state) => {
            state.assets = [];
        },
        addUser: (state, action: PayloadAction<TUser[]>) => {
            state.users = action.payload;
        },
        removeUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter((m) => m.id !== action.payload);
        },
        clearUser: (state) => {
            state.users = [];
        },
    },
});

export const {
    addAsset,
    removeAsset,
    clearAssets,
    addUser,
    removeUser,
    clearUser,
} = assetsSlice.actions;
export default assetsSlice.reducer;

const asset = (state: RootState) => state.assets.assets;
const users = (state: RootState) => state.assets.users;

export const assetSelector = createSelector([asset], (asset) => asset);
export const userSelector = createSelector([users], (users) => users);
