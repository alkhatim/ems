import http from "../helpers/http";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from "./types";
import messages from "../helpers/messages";

export const login = (username, password) => async dispatch => {
  try {
    const res = await http.post("/api/logins", { username, password });
    const user = res.data;
    const token = res.headers["x-jwt"];
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token,
        user
      }
    });
  } catch (error) {
    messages.error(error);
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const register = (username, password) => async dispatch => {
  try {
    const res = await http.post("/api/users", { username, password });
    const user = res.data;
    const token = res.headers["x-jwt"];
    dispatch({
      type: REGISTER_SUCCESS,
      payload: {
        token,
        user
      }
    });
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL
    });
    messages.error(error);
  }
};

export const loadUser = () => async dispatch => {
  const token = localStorage.getItem("jwt");

  if (!token)
    return dispatch({
      type: LOGIN_FAIL
    });

  http.setToken(token);

  try {
    const res = await http.get("/api/logins");
    const user = res.data;
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token,
        user
      }
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL
    });
  }
};
