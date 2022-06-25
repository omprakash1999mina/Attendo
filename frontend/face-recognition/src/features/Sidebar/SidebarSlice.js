import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const SidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    smallSidebarOpen: (state, action) => {
      state.open = true;
    },
    smallSidebarClose: (state, action) => {
      state.open = false;
    },
  },
});

export const { smallSidebarOpen, smallSidebarClose } = SidebarSlice.actions;
export const getSidebar = (state) => state.sidebar;
export default SidebarSlice.reducer;
