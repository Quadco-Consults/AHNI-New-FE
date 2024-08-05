import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import baseAPI from "../services";
import storage from "redux-persist/es/storage/session";
import auth from "./auth/authSlice";
import ui from "./ui";
import partnerLocation from "./formData/project-values";
import objectives from "./formData/project-objective";
import ssp from "./formData/ssp-values";
import vendors from "./formData/procurement-vendors";
import assets from "./assets";

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
  objectives,
  ssp,
  vendors,
  assets,
});

export const rootReducer = persistReducer(persistConfig, rootStore);
