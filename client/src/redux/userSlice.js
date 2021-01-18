import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    pairId: null,
    user0: {},
    user1: {},
    username: null,
    user: null,
    matched: false,
    inviteCode: null,
    budget: null,
    defaultExpenseAllocation: null,
    anniversary: null,
    login: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.pairId = action.payload.pairId || state.pairId;
      state.user0 = action.payload.user0 || state.user0;
      state.user1 = action.payload.user1 || state.user1;
      state.username = action.payload.username || state.username;
      state.user = action.payload.user || state.user;
      state.matched = action.payload.matched || false;
      state.inviteCode = action.payload.inviteCode || state.inviteCode;
      state.budget = action.payload.budget || state.budget;
      state.defaultExpenseAllocation =
        action.payload.defaultExpenseAllocation ||
        state.defaultExpenseAllocation;
      state.anniversary = action.payload.anniversary || state.anniversary;
      state.login = action.payload.login || false;
    },
  },
});
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;
