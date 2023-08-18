import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import filterReducer from "../redux/features/auth/filterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filter: filterReducer,
  },
});
