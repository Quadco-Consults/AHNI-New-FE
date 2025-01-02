import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TPartnerData } from "definations/modules/project/partners";

type TInitialState = {
    consortiumPartners: TPartnerData[];
};

const initialState: TInitialState = {
    consortiumPartners: [],
};

const partnerSlice = createSlice({
    name: "partner",
    initialState,
    reducers: {
        addPartner: (state, { payload }: PayloadAction<TPartnerData[]>) => {
            state.consortiumPartners = payload;
        },

        clearPartners: (state) => {
            state.consortiumPartners = [];
        },
    },
});

export const { addPartner, clearPartners } = partnerSlice.actions;

export default partnerSlice.reducer;
