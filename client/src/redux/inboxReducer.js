import {
  INBOX_LOADED,
  INBOX_LOAD_FAILED,
  MESSAGE_READ,
  MESSAGE_READ_FAILED
} from "../actions/ActionTypes";

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

    case MESSAGE_READ:
      return {
        ...state,
        inbox: state.inbox
          .map(message => (message._id === payload._id ? payload : message))
          .reverse()
      };

    case INBOX_LOAD_FAILED:
    case MESSAGE_READ_FAILED:
      return state;

    default:
      return state;
  }
}
