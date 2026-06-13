import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { z } from "zod";
import { RootState } from "..";
import { uiSchema } from "definitions/schema";

type intialState = z.infer<typeof uiSchema>;

type Sheet = { type: string; sheetProps?: Record<string, string | Object> };
type Dailog = { type: string; dialogProps?: any };

const initialState: intialState = {
    dialog: {
        isOpen: false,
        type: "",
        dialogProps: {},
    },

    sheet: {
        isOpen: false,
        type: "",
        sheetProps: {},
    },
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openSheet: (state, { payload }: PayloadAction<Sheet>) => {
            state.sheet.isOpen = true;
            state.sheet.type = payload.type;
            state.sheet.sheetProps = payload.sheetProps;
        },
        closeSheet: (state) => {
            state.sheet = initialState.sheet;
        },
        openDialog: (state, { payload }: PayloadAction<Dailog>) => {
            state.dialog.isOpen = true;
            state.dialog.type = payload.type;
            state.dialog.dialogProps = payload.dialogProps;
        },
        closeDialog: (state) => {
            state.dialog = initialState.dialog;
        },

        resetUiState: () => {
            return initialState;
        },
    },
});

export const { openDialog, closeDialog, openSheet, closeSheet, resetUiState } =
    uiSlice.actions;

export default uiSlice.reducer;

const sheet = ({ ui: { sheet } }: RootState) => sheet;
const dialog = ({ ui: { dialog } }: RootState) => dialog;

export const sheetSelector = createSelector([sheet], (sheet) => sheet);
export const dialogSelector = createSelector([dialog], (dialog) => ({ ...dialog }));
