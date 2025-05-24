import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
