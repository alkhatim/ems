import {
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOAD_FAILED,
  SIGNED_OUT
} from "../actions/types";

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false,
  isLoading: true
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        token: payload.token,
        user: payload.user,
        isLoggedIn: true,
        isLoading: false
      };

    case USER_LOAD_FAILED:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case SIGNED_OUT:
      return {
        ...state,
        token: null,
        user: null,
        isLoggedIn: false,
        isLoading: false
      };

    default:
      return state;
  }
}
