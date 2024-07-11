import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  items: [],
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    addPartnerLocation: (state, { payload }: PayloadAction<any>) => {
      state.items.push(payload);
    },
    clearPartnerLocation: (state) => {
      state.items = [];
    },
  },
});

export const partnerActions = partnerSlice.actions;

export default partnerSlice.reducer;
