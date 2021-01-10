import { createSlice } from "@reduxjs/toolkit";

export const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: {},
    debt: {},
  },
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload.expenses;
    },
    setDebt: (state, action) => {
      state.debt = action.payload.debt;
    },
  },
});
export const { setExpenses, setDebt } = expenseSlice.actions;
export default expenseSlice.reducer;
export const selectExpenses = (state) => state.expenses;
