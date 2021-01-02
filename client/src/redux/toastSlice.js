import { createSlice } from "@reduxjs/toolkit";

export const toastSlice = createSlice({
  name: "toast",
  initialState: {
    backdrop: false,
  },
  reducers: {
    setToast: (state, action) => {
      state.backdrop = action.payload.backdrop;
    },
  },
});
export const { setToast } = toastSlice.actions;
export default toastSlice.reducer;
export const selectToast = (state) => state.toast;
