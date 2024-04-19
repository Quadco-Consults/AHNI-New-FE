import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import baseAPI from "../services";
import storage from "redux-persist/es/storage";
import auth from "./auth/authSlice";
import ui from "./ui";

const persistConfig = {
  storage,

  key: "ahni",
};

export const rootStore = combineReducers({
  // ...your reducers here
  [baseAPI.reducerPath]: baseAPI.reducer,
  auth,
  ui,
});

export const rootReducer = persistReducer(persistConfig, rootStore);
