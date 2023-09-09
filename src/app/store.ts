import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import boardReducer from "../features/board/boardSlice";
import themerReducer from "../features/theme/themeSlice";

export const store = configureStore({
    reducer: {
        board: boardReducer,
        theme: themerReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
