import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const UserPasswordSlice = createSlice({
  name: "userPassword",
  initialState,
  reducers: {
    setDefaultPassword: (state, action) => {
      state.defaultPassword = action.payload
    },
  },
});

export const { setDefaultPassword } = UserPasswordSlice.actions;
export const getPassword = (state) => state.userPassword;
export default UserPasswordSlice.reducer;
