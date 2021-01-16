import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    pairId: null,
    name0: null,
    name1: null,
    username: null,
    matched: false,
    budget: null,
    defaultExpenseAllocation: null,
    login: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.pairId = action.payload.pairId || state.pairId;
      state.name0 = action.payload.name0 || state.name0;
      state.name1 = action.payload.name1 || state.name1;
      state.username = action.payload.username || state.username;
      state.matched = action.payload.matched || false;
      state.budget = action.payload.budget || state.budget;
      state.defaultExpenseAllocation =
        action.payload.defaultExpenseAllocation ||
        state.defaultExpenseAllocation;
      state.login = action.payload.login || false;
    },
  },
});
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;
