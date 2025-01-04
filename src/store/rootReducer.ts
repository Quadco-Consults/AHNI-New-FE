import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import baseAPI from "../services";
import storage from "redux-persist/es/storage/session";
import auth from "./auth/authSlice";
import ui from "./ui";
import consortiumPartnerReducer from "./formData/project-values";
import objectives from "./formData/project-objective";
import ssp from "./formData/ssp-values";
import vendors from "./formData/procurement-vendors";
import assets from "./assets";
import stakeholder from "./formData/stakeholders";
import teamMember from "./admin/team-members";

const persistConfig = {
    storage,
    key: "ahni",
    blacklist: [
        baseAPI.reducerPath,
        "objectives",
        "partnerLocation",
        "stakeholder",
        "consortiumPartner",
        "teamMember",
    ],
};

export const rootStore = combineReducers({
    // ...your reducers here
    [baseAPI.reducerPath]: baseAPI.reducer,
    auth,
    ui,
    consortiumPartner: consortiumPartnerReducer,
    objectives,
    ssp,
    vendors,
    assets,
    stakeholder,
    teamMember,
});

export const rootReducer = persistReducer(persistConfig, rootStore);
