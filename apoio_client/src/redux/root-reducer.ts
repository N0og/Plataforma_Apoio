import { combineReducers } from "redux";
import pageReducer from "./pages/reducer";
import { modalReducer } from "./modal/reducer";
import { userReducer } from "./user/reducer";

export const rootReducer = combineReducers({
  pageReducer,
  modalReducer,
  userReducer
});

export type rootReducer = ReturnType<typeof rootReducer>;
