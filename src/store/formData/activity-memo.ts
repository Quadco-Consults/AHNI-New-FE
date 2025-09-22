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
    updateActivity: (state, { payload }: PayloadAction<{ index: number; data: any }>) => {
      if (state.activity[payload.index]) {
        state.activity[payload.index] = payload.data;
      }
    },
    clearActivity: (state) => {
      state.activity = [];
    },
  },
});

export const activityActions = activitySlice.actions;

export default activitySlice.reducer;
