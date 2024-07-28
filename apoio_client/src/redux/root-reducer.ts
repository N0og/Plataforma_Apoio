import { combineReducers } from "redux";
import pageReducer from "./pages/reducer";

export const rootReducer = combineReducers({pageReducer})
export type rootReducer = ReturnType<typeof rootReducer>;