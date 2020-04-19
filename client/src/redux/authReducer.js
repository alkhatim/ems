import {
  USER_LOADED,
  LOGGED_IN,
  LOGIN_FAILED,
  REGISTERED,
  REGISTER_FAILED,
  USER_LOAD_FAILED,
  LOGGED_OUT,
} from "../actions/types";

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false,
  isLoading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
    case LOGGED_IN:
      return {
        ...state,
        token: payload.token,
        user: payload.user,
        isLoggedIn: true,
        isLoading: false,
      };

    case USER_LOAD_FAILED:
    case LOGIN_FAILED:
    case LOGGED_OUT:
      return {
        ...state,
        token: null,
        user: null,
        isLoggedIn: false,
        isLoading: false,
      };

    case REGISTERED:
    case REGISTER_FAILED:
      return state;

    default:
      return state;
  }
}
