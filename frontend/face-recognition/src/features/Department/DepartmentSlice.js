import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const DepartmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setCurrentDeptName: (state, action) => {
      state.deptName = action.payload
    },
    setColor: (state, action) => {
      state.color = action.payload
    },
    setAbv: (state, action) => {
      state.abv = action.payload
    }
  },
});

export const { setCurrentDeptName, setColor, setAbv} = DepartmentSlice.actions;
export const getDepartment = (state) => state.department;
export default DepartmentSlice.reducer;
