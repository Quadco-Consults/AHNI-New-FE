import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface VendorState {
  currentVendor: any;
  vendors: any[];
}

const initialState: VendorState = {
  currentVendor: {},
  vendors: [],
};

const vendorsSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    addVendors: (state, { payload }: PayloadAction<any>) => {
      state.vendors.push(payload);
    },
    updateCurrentVendor: (state, { payload }: PayloadAction<any>) => {
      state.currentVendor = { ...state.currentVendor, ...payload };
    },
    setCurrentVendor: (state, { payload }: PayloadAction<any>) => {
      state.currentVendor = payload;
    },
    clearCurrentVendor: (state) => {
      state.currentVendor = {};
    },
    clearVendors: (state) => {
      state.vendors = [];
    },
  },
});

export const vendorsActions = vendorsSlice.actions;

export default vendorsSlice.reducer;
