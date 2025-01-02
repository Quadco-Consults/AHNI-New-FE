import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TStakeholderRegisterData } from "definations/program-validator";

type TInitialState = {
    selectedStakeholders: TStakeholderRegisterData[];
};

const initialState: TInitialState = {
    selectedStakeholders: [],
};

const stakeholderSlice = createSlice({
    name: "stakeholder",
    initialState,
    reducers: {
        addStakeholders: (
            state,
            { payload }: PayloadAction<TStakeholderRegisterData[]>
        ) => {
            state.selectedStakeholders = payload;
        },

        removeStakeholder: (state, { payload }: PayloadAction<string>) => {
            state.selectedStakeholders = state.selectedStakeholders.filter(
                (stakeholder) => stakeholder.id !== payload
            );
        },
    },
});

export default stakeholderSlice.reducer;
export const { addStakeholders, removeStakeholder } = stakeholderSlice.actions;
