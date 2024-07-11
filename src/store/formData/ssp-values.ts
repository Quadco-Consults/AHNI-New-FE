import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  items: [],
};

const supportiveSupervisionSlice = createSlice({
  name: "supportiveSupervision",
  initialState,
  reducers: {
    addSupportiveSupervision: (state, { payload }: PayloadAction<any>) => {
      state.items.push(payload);
    },
    clearSupportiveSupervision: (state) => {
      state.items = [];
    },
  },
});

export const supportiveSupervisionActions = supportiveSupervisionSlice.actions;

export default supportiveSupervisionSlice.reducer;
