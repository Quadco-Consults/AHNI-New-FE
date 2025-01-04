import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "definations/auth/user";

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
