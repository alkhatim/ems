import http from "../services/http";
import {
  INBOX_LOADED,
  INBOX_LOAD_FAILED,
  MESSAGE_READ,
  MESSAGE_READ_FAILED,
  MESSAGE_LOADED,
  MESSAGE_LOAD_FAILED
} from "./ActionTypes";
import messages from "../services/messages";

export const loadInbox = () => async dispatch => {
  try {
    const res = await http.get("/messages/inbox");
    const inbox = res.data.messages;
    for (let message of inbox) {
      const res = await http.get("/users/avatar/" + message.from._id);
      const avatar = res.data;
      message.from.avatar = avatar;
    }
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

export const getMessage = messageId => async dispatch => {
  try {
    const res = await http.get("/messages/" + messageId);
    const message = res.data;
    dispatch({
      type: MESSAGE_LOADED,
      payload: message
    });
  } catch (error) {
    messages.error(error);
    dispatch({
      type: MESSAGE_LOAD_FAILED
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

export const sendMessage = async message => {
  return await http.post("/messages", message);
};
