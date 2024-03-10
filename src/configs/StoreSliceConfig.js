import { createSlice } from "@reduxjs/toolkit";
import { logoutAction } from "./StoreActionConfig";

export const globalInitialState = {
  authUser: null,
};

const slice = createSlice({
  name: "global",
  initialState: globalInitialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(logoutAction, () => ({ ...globalInitialState })),
  // .addMatcher(
  //   LoginApi.endpoints.login.matchFulfilled,
  //   (state, { payload }) => {
  //     state.authUser = {
  //       accessToken: payload?.access_token,
  //       ...payload.data?.user,
  //     };
  //   }
  // ),
});

export default slice;

export function getGlobalSliceStorageState({ authUser }) {
  return { authUser };
}
