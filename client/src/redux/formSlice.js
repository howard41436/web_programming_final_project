import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
  name: "form",
  initialState: {
    form: {},
  },
  reducers: {
    setForm: (state, action) => {
      state.form[action.payload.formId] = action.payload.form;
    },
  },
});
export const { setForm } = formSlice.actions;
export default formSlice.reducer;
export const selectForm = (formId) => (state) =>
  state.form.form[formId] ? state.form.form : { [formId]: {} };
