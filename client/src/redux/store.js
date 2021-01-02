import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import infoReducer from "./infoSlice";
import expenseReducer from "./expenseSlice";
import formReducer from "./formSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    info: infoReducer,
    expenses: expenseReducer,
    form: formReducer,
  },
});
