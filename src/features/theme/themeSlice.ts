import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type Theme = "light" | "dark";

interface ThemeState {
    type: Theme;
}

const initialState: ThemeState = {
    type: window.matchMedia("(prefers-color-scheme: dark)")?.matches ? "dark" : "light",
};

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        changeTheme: (state) => {
            if (state.type == "light") {
                state.type = "dark";
            } else {
                state.type = "light";
            }
        },
    },
});

export const { changeTheme } = themeSlice.actions;

export const currentTheme = (state: RootState) => state.theme.type;

export default themeSlice.reducer;
