import { INBOX_LOADED, INBOX_LOAD_FAILED } from "../actions/ActionTypes";

const initialState = {
  inbox: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case INBOX_LOADED:
      return {
        ...state,
        inbox: payload
      };

    case INBOX_LOAD_FAILED:
      return state;

    default:
      return state;
  }
}
