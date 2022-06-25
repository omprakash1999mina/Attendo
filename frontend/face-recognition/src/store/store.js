import { configureStore } from "@reduxjs/toolkit";
import SidebarSlice from "../features/Sidebar/SidebarSlice";
import DepartmentSlice from "../features/Department/DepartmentSlice"
import UserPasswordSlice from "../features/User/UserPasswordSlice"
export const store = configureStore({
  reducer: {
    sidebar: SidebarSlice,
    department : DepartmentSlice,
    userPassword: UserPasswordSlice
  },
});
