import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import baseAPI from "../services";
import storage from "redux-persist/es/storage";
import auth from "./auth/authSlice";
import ui from "./ui";
import partnerLocation from "./formData/project-values";
import objectives from "./formData/project-objective";
import ssp from "./formData/ssp-values";

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
});

export const rootReducer = persistReducer(persistConfig, rootStore);
