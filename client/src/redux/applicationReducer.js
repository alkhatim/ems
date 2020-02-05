import { LOADING, LOADED } from "../actions/ActionTypes";

const initialState = {
  loading: false
};

export default function(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case LOADING:
      return {
        ...state,
        loading: true
      };

    case LOADED:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
}
