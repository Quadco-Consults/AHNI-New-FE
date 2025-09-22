import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
// Services removed - using TanStack Query instead

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined"
  ? require("redux-persist/es/storage/session").default
  : createNoopStorage();
import auth from "./auth/authSlice";
import ui from "./ui";
import consortiumPartnerReducer from "./formData/project-values";
import objectives from "./formData/project-objective";
import ssp from "./formData/ssp-values";
import vendors from "./formData/procurement-vendors";
import onboarding from "./formData/onboarding";
import activity from "./formData/activity-memo";
import assets from "./assets";
import stakeholder from "./formData/stakeholders";
import teamMember from "./admin/team-members";
import steps from "./stepTracker";

const persistConfig = {
  storage,
  key: "ahni",
  blacklist: [
    "objectives",
    "partnerLocation",
    "stakeholder",
    "consortiumPartner",
    "teamMember",
  ],
};

export const rootStore = combineReducers({
  // RTK Query services removed - using TanStack Query instead
  auth,
  ui,
  consortiumPartner: consortiumPartnerReducer,
  objectives,
  ssp,
  vendors,
  activity,
  assets,
  stakeholder,
  teamMember,
  steps,
  onboarding,
});

export const rootReducer = persistReducer(persistConfig, rootStore);
