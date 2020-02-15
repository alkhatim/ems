import { combineReducers } from "redux";
import appReducer from "./appReducer";
import authReducer from "./authReducer";
import inboxReducer from "./inboxReducer";
import employeeReducer from "./employeeReducer";

export default combineReducers({
  appReducer,
  authReducer,
  inboxReducer,
  employeeReducer
});
