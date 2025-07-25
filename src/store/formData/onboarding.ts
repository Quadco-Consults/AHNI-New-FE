import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  applicant: [],
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    onboardApplicant: (state, { payload }: PayloadAction<any>) => {
      state.applicant.push(payload);
    },
    clearApplicant: (state) => {
      state.applicant = [];
    },
  },
});

export const onboardingActions = onboardingSlice.actions;

export default onboardingSlice.reducer;
