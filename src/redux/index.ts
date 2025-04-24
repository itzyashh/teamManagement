import { configureStore } from "@reduxjs/toolkit";
import TeamReducer from "./reducers/Team";
import UserReducer from "./reducers/User";
export const store = configureStore({
    reducer:{
        teams: TeamReducer,
        user: UserReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;