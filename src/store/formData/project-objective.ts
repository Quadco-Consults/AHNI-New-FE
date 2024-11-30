import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TProjectObjective } from "components/modals/dailog/components/ProjectObjectiveModal";

type TInitialSatate = {
    objectives: TProjectObjective[];
};

const initialState: TInitialSatate = {
    objectives: [],
};

const objectivesSlice = createSlice({
    name: "objectives",
    initialState,
    reducers: {
        addObjective: (state, { payload }: PayloadAction<any>) => {
            state.objectives.push(payload);
        },

        removeObjective: (state, { payload }: PayloadAction<string>) => {
            state.objectives = state.objectives.filter(
                (obj) => obj.objective !== payload
            );
        },

        clearObjectives: (state) => {
            state.objectives = [];
        },
    },
});

export const { addObjective, removeObjective, clearObjectives } =
    objectivesSlice.actions;

export default objectivesSlice.reducer;
