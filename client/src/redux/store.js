import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import infoReducer from "./infoSlice";
import expenseReducer from "./expenseSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    info: infoReducer,
    expenses: expenseReducer,
  },
});
