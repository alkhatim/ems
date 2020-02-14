import {
  EMPTY_INBOX,
  INBOX_LOADED,
  INBOX_LOAD_FAILED,
  MESSAGE_READ,
  MESSAGE_READ_FAILED,
  MESSAGE_LOADED,
  MESSAGE_LOAD_FAILED,
  MESSAGE_SENT,
  MESSAGE_SEND_FAILED
} from "../actions/ActionTypes";

const initialState = {
  inbox: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case EMPTY_INBOX:
      return { ...state, inbox: [] };

    case INBOX_LOADED:
      return {
        ...state,
        inbox: payload
      };

    case MESSAGE_LOADED:
      return {
        ...state,
        inbox: state.inbox.map(message =>
          message._id === payload._id ? payload : message
        )
      };

    case MESSAGE_READ:
      return {
        ...state,
        inbox: state.inbox.map(message =>
          message._id === payload._id ? payload : message
        )
      };

    case INBOX_LOAD_FAILED:
    case MESSAGE_READ_FAILED:
    case MESSAGE_LOAD_FAILED:
    case MESSAGE_SENT:
    case MESSAGE_SEND_FAILED:
      return state;

    default:
      return state;
  }
}
