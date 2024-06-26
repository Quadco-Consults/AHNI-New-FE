import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type PartnerProps = {
  location_id: string;
  partner_ids: string[];
};

interface InitialStateProps {
  items: PartnerProps[];
}

const initialState: InitialStateProps = {
  items: [],
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    addPartnerLocation: (state, { payload }: PayloadAction<PartnerProps>) => {
      state.items.push(payload);
    },
  },
});

export const partnerActions = partnerSlice.actions;

export default partnerSlice.reducer;
