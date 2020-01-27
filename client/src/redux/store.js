import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducder from "./rootReducer";

const initialState = {};
const middleware = [thunk];
const store = createStore(
  rootReducder,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
