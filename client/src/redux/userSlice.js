import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    pairId: null,
    name: null,
    name1: null,
    username: null,
    icon: null,
    icon1: null,
    user: null,
    matched: false,
    inviteCode: null,
    budget: null,
    defaultExpenseAllocation: null,
    login: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.pairId = action.payload.pairId || state.pairId;
      state.name = action.payload.name || state.name;
      state.name1 = action.payload.name1 || state.name1;
      state.username = action.payload.username || state.username;
      state.icon = action.payload.icon || state.icon;
      state.icon1 = action.payload.icon1 || state.icon1;
      state.user = action.payload.user || state.user;
      state.matched = action.payload.matched || false;
      state.inviteCode = action.payload.inviteCode || state.inviteCode;
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
