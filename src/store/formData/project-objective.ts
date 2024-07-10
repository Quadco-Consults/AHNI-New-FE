import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  objectives: [],
};

const objectivesSlice = createSlice({
  name: "objectives",
  initialState,
  reducers: {
    addObjectives: (state, { payload }: PayloadAction<any>) => {
      state.objectives.push(payload);
    },
    clearObjectives: (state) => {
      state.objectives = [];
    },
  },
});

export const objectivesActions = objectivesSlice.actions;

export default objectivesSlice.reducer;
