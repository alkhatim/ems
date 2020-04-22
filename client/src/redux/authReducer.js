import types from "../actions/types";

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false,
  isLoading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.USER_LOADED:
    case types.LOGGED_IN:
      return {
        ...state,
        token: payload.token,
        user: payload.user,
        isLoggedIn: true,
        isLoading: false,
      };

    case types.USER_LOAD_FAILED:
    case types.LOGIN_FAILED:
    case types.LOGGED_OUT:
      return {
        ...state,
        token: null,
        user: null,
        isLoggedIn: false,
        isLoading: false,
      };

    case types.REGISTERED:
    case types.REGISTER_FAILED:
      return state;

    default:
      return state;
  }
}
