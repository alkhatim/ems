import types from "../actions/types";

const initialState = {
  loading: false,
};

export default function (state = initialState, action) {
  const { type } = action;

  switch (type) {
    case types.LOADING:
      return {
        ...state,
        loading: true,
      };

    case types.LOADED:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
