import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  email: string;
  accessToken: string | null;
}

const initialState: AuthState = {
  email: "",
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
    },
    clearAuth: (state) => {
      state.email = "";
      state.accessToken = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
