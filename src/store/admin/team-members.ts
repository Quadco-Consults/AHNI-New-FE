import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "features/auth/types/user";

type InitialState = {
    teamMembers: IUser[];
};

const initialState: InitialState = {
    teamMembers: [],
};

const teamMemberSlice = createSlice({
    name: "teamMember",
    initialState,
    reducers: {
        addTeamMembers: (state, { payload }: PayloadAction<IUser[]>) => {
            state.teamMembers = payload;
        },

        clearTeamMembers: (state) => {
            state.teamMembers = [];
        },
    },
});

export const { addTeamMembers, clearTeamMembers } = teamMemberSlice.actions;

export default teamMemberSlice.reducer;
