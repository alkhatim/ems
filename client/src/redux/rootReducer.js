import { combineReducers } from "redux";
import applicationReducer from "./applicationReducer";
import authReducer from "./authReducer";

export default combineReducers({ authReducer, applicationReducer });
