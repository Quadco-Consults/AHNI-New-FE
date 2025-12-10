import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage instead of sessionStorage
// Services removed - using TanStack Query instead

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// Silently suppress redux-persist storage warnings during SSR
if (typeof window === "undefined") {
  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args[0];
    if (typeof message === "string" && message.includes("redux-persist failed to create sync storage")) {
      return; // Silently ignore redux-persist SSR warnings
    }
    originalConsoleWarn.apply(console, args);
  };
}

// Check if we're in a browser environment
const isClient = typeof window !== "undefined";
const persistStorage = isClient ? storage : createNoopStorage();
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
  storage: persistStorage,
  key: "ahni",
  version: 1,
  migrate: (state: any) => {
    // Handle any state migration if needed
    return Promise.resolve(state);
  },
  blacklist: [
    "auth", // Prevent auth state persistence to avoid stale user data
    "objectives",
    "partnerLocation",
    "stakeholder",
    "consortiumPartner",
    "teamMember",
  ],
  // Only persist if we're in the client
  serialize: isClient ? true : false,
  deserialize: isClient ? true : false,
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
