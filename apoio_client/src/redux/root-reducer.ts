import { combineReducers } from "redux";
import pageReducer from "./pages/reducer";
import { modalReducer } from "./modal/reducer";
import { userReducer } from "./user/reducer";

// Combine os reducers
export const rootReducer = combineReducers({
  pageReducer,
  modalReducer,
  userReducer
});

// Cria o tipo do rootReducer
export type rootReducer = ReturnType<typeof rootReducer>;
