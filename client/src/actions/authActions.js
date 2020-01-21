import http from "../helpers/http";
import {
  USER_LOADED,
  USER_LOAD_FAILED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  SIGNED_OUT
} from "./types";
import messages from "../helpers/messages";

export const login = (username, password) => async dispatch => {
  try {
    const res = await http.post("/api/logins", { username, password });
    const user = res.data;
    const token = res.headers["x-jwt"];
    localStorage.setItem("jwt", token);
    http.setToken(token);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        user
      }
    });
  } catch (error) {
    messages.error(error);
    localStorage.removeItem("jwt");
    http.setToken(null);
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const register = (username, password, isAdmin) => async dispatch => {
  try {
    const role = isAdmin ? "admin" : "user";
    const res = await http.post("/api/users", { username, password, role });
    const user = res.data;
    const token = res.headers["x-jwt"];
    localStorage.setItem("jwt", token);
    http.setToken(token);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: {
        token,
        user
      }
    });
  } catch (error) {
    localStorage.removeItem("jwt");
    http.setToken(null);
    messages.error(error);
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

export const loadUser = () => async dispatch => {
  const token = localStorage.getItem("jwt");

  if (!token)
    return dispatch({
      type: USER_LOAD_FAILED
    });

  http.setToken(token);

  try {
    const res = await http.get("/api/logins");
    const user = res.data;
    dispatch({
      type: USER_LOADED,
      payload: {
        token,
        user
      }
    });
  } catch (error) {
    http.setToken(null);
    localStorage.removeItem("jwt");
    dispatch({
      type: USER_LOAD_FAILED
    });
  }
};

export const signOut = () => async dispatch => {
  localStorage.removeItem("jwt");
  http.setToken(null);
  dispatch({
    type: SIGNED_OUT
  });
};
