import http from "../utils/http";
import { toast } from "react-toastify";
import { LOGIN_SUCCESS, LOGIN_FAIL } from "./types";

export const login = (username, password) => async dispatch => {
  try {
    const res = await http.post("/api/login", { username, password });
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
    toast.error(error.response.data, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 5000
    });
    dispatch({
      type: LOGIN_FAIL
    });
  }
};
