import types from "../actions/types";

const initialState = {
  inbox: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.EMPTY_INBOX:
      return { ...state, inbox: [] };

    case types.INBOX_LOADED:
      return {
        ...state,
        inbox: payload,
      };

    case types.MESSAGE_LOADED:
      return {
        ...state,
        inbox: state.inbox.map((message) =>
          message._id === payload._id ? payload : message
        ),
      };

    case types.MESSAGE_READ:
      return {
        ...state,
        inbox: state.inbox.map((message) =>
          message._id === payload._id ? { ...message, read: true } : message
        ),
      };

    case types.INBOX_LOAD_FAILED:
    case types.MESSAGE_READ_FAILED:
    case types.MESSAGE_LOAD_FAILED:
    case types.MESSAGE_SENT:
    case types.MESSAGE_SEND_FAILED:
      return state;

    default:
      return state;
  }
}
