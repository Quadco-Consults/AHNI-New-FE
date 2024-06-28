import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import baseAPI from "../services";
import storage from "redux-persist/es/storage/session";
import auth from "./auth/authSlice";
import ui from "./ui";
import partnerLocation from "./formData/partner-location";

const persistConfig = {
  storage,
  key: "ahni",
};

export const rootStore = combineReducers({
  // ...your reducers here
  [baseAPI.reducerPath]: baseAPI.reducer,
  auth,
  ui,
  partnerLocation,
});

export const rootReducer = persistReducer(persistConfig, rootStore);
