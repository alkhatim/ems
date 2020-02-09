import http from "../services/http";
import {
  INBOX_LOADED,
  INBOX_LOAD_FAILED,
  MESSAGE_READ,
  MESSAGE_READ_FAILED
} from "./ActionTypes";
import messages from "../services/messages";

export const loadInbox = () => async dispatch => {
  try {
    const res = await http.get("/messages/inbox");
    const inbox = res.data.messages;
    dispatch({
      type: INBOX_LOADED,
      payload: inbox
    });
  } catch (error) {
    messages.error(error);
    dispatch({
      type: INBOX_LOAD_FAILED
    });
  }
};

export const readMessage = messageId => async dispatch => {
  try {
    const res = await http.post("/messages/" + messageId);
    const message = res.data;
    dispatch({ type: MESSAGE_READ, payload: message });
  } catch (error) {
    messages.error(error);
    dispatch({
      type: MESSAGE_READ_FAILED
    });
  }
};
