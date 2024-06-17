import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const authStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof authStore.getState>;
export type AppDispatch = typeof authStore.dispatch;

export default authStore;
