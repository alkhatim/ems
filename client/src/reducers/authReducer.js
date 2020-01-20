import http from "../helpers/http";
import { LOGIN_SUCCESS, LOGIN_FAIL } from "../actions/types";

const token = localStorage.getItem("jwt");

const getUser = async () => {
  if (!token) return null;

  http.setToken(token);
  try {
    const res = await http.get("/api/logins");
    console.log(res);
    return res.data;
  } catch (error) {
    return null;
  }
};

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("jwt", payload.token);
      http.setToken(payload.token);
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        isLoggedIn: true
      };

    case LOGIN_FAIL:
      localStorage.removeItem("jwt");
      http.removeToken();
      return {
        ...state,
        token: null,
        user: null,
        isLoggedIn: false
      };

    default:
      return state;
  }
}
