import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  vendors: [],
};

const vendorsSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    addVendors: (state, { payload }: PayloadAction<any>) => {
      state.vendors.push(payload);
    },
    clearVendors: (state) => {
      state.vendors = [];
    },
  },
});

export const vendorsActions = vendorsSlice.actions;

export default vendorsSlice.reducer;
