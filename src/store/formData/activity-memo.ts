import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  activity: [],
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    addActivity: (state, { payload }: PayloadAction<any>) => {
      state.activity.push(payload);
    },
    clearActivity: (state) => {
      state.activity = [];
    },
  },
});

export const activityActions = activitySlice.actions;

export default activitySlice.reducer;
