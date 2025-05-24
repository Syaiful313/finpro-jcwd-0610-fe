import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number;
  name: string;
  email: string;
  token: string;
}

const initialState: UserState = {
  id: 0,
  name: "",
  email: "",
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    logoutAction: (state) => {
      state.id = 0;
      state.name = "";
      state.email = "";
      state.token = "";
    },
  },
});

export const {loginAction, logoutAction} = userSlice.actions;

export default userSlice.reducer;
