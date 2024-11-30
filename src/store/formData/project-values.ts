import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type TInitialState = {
    partners: string[];
};

const initialState: TInitialState = {
    partners: [],
};

const partnerSlice = createSlice({
    name: "partner",
    initialState,
    reducers: {
        addPartners: (state, { payload }: PayloadAction<string[]>) => {
            state.partners = payload;
        },

        removePartner: (state, { payload }: PayloadAction<string>) => {
            state.partners = state.partners.filter(
                (partner) => partner !== payload
            );
        },

        clearPartners: (state) => {
            state.partners = [];
        },
    },
});

export const { addPartners, removePartner, clearPartners } =
    partnerSlice.actions;

export default partnerSlice.reducer;
