import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    pairId: null,
    boyName: null,
    girlName: null,
    ready: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.pairId = action.payload.pairId;
      state.boyName = action.payload.boyName;
      state.girlName = action.payload.girlName;
      state.ready = action.payload.ready;
    },
  },
});
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => state.user;
