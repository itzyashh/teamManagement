import { configureStore } from "@reduxjs/toolkit";
import TeamReducer from "./reducers/Team";
export const store = configureStore({
    reducer:{
        teams: TeamReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;