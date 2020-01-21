import http from "../helpers/http";
import {
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOAD_FAILED
} from "../actions/types";

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        token: payload.token,
        user: payload.user,
        isLoggedIn: true
      };

    case USER_LOAD_FAILED:
      return {
        ...state,
        token: null,
        user: null,
        isLoggedIn: false
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        isLoggedIn: true
      };

    case LOGIN_FAIL:
      return {
        ...state,
        token: null,
        user: null,
        isLoggedIn: false
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        isLoggedIn: true
      };

    case REGISTER_FAIL:
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
