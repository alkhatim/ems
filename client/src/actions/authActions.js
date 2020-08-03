import http from "../services/http";
import types from "./types";
import messages from "../services/messages";

export const login = (username, password) => async (dispatch) => {
  try {
    const res = await http.post("/logins", { username, password });
    const user = res.data;
    const token = res.headers["x-jwt"];
    localStorage.setItem("jwt", token);
    http.setToken(token);
    dispatch({
      type: types.LOGGED_IN,
      payload: {
        user,
        token,
      },
    });
    dispatch({ type: types.EMPTY_INBOX });
  } catch (error) {
    messages.error(error);
    localStorage.removeItem("jwt");
    http.setToken(null);
    dispatch({
      type: types.LOGIN_FAILED,
    });
  }
};

export const register = (username, password, avatar, isAdmin) => async (
  dispatch
) => {
  try {
    const role = isAdmin ? "admin" : "user";
    await http.post("/users", {
      username,
      password,
      avatar,
      role,
    });
    messages.success("User registered");
    dispatch({
      type: types.REGISTERED,
    });
  } catch (error) {
    messages.error(error);
    dispatch({
      type: types.REGISTER_FAILED,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem("jwt");

  if (!token)
    return dispatch({
      type: types.USER_LOAD_FAILED,
    });

  http.setToken(token);

  try {
    const res = await http.get("/logins");
    const user = res.data;
    dispatch({
      type: types.USER_LOADED,
      payload: {
        token,
        user,
      },
    });
  } catch (error) {
    if (error.response.status === 400 || error.response.status === 401) {
      http.setToken(null);
      localStorage.removeItem("jwt");
    }
    dispatch({
      type: types.USER_LOAD_FAILED,
    });
  }
};

export const logOut = () => async (dispatch) => {
  localStorage.removeItem("jwt");
  http.setToken(null);
  dispatch({
    type: types.LOGGED_OUT,
  });
};
