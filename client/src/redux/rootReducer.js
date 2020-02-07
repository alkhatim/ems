import { combineReducers } from "redux";
import appReducer from "./appReducer";
import authReducer from "./authReducer";
import inboxReducer from "./inboxReducer";

export default combineReducers({ appReducer, authReducer, inboxReducer });
