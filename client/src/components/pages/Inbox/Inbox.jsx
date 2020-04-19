import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadInbox,
  readMessage,
  getMessage
} from "../../../actions/inboxActions";
import Message from "../../shared/Message";
import MessageView from "./MessageView";
import Compose from "./Compose";
import PageHeader from "../../shared/PageHeader";
import Fab from "../../shared/Fab";
import M from "materialize-css";

export const Inbox = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const modal = document.querySelectorAll(".modal");
    M.Modal.init(modal, {});
    dispatch(loadInbox());
  }, [dispatch]);

  const { inbox } = useSelector(store => store.inboxReducer);

  const handleMessageSelect = message => {
    if (message.hasAttachments && !message.attachments)
      dispatch(getMessage(message._id));
    setSelectedMessage(message);
    if (message.read === false) dispatch(readMessage(message._id));
  };

  return (
    <div className="row">
      <PageHeader
        title="Inbox"
        icon="fa fa-inbox"
        color="blue-text text-darken-2"
        url="/inbox"
      />
      <div className="col s12 l3 p-0">
        <ul className="collection inbox-container mt-0">
          {inbox.map(message => (
            <Message
              message={message}
              key={message._id}
              onMessageClick={message => handleMessageSelect(message)}
            />
          ))}
        </ul>
      </div>
      <div className="col l9 hide-on-small-only p-0">
        <div className="inbox-view">
          {selectedMessage ? (
            <MessageView message={selectedMessage} />
          ) : (
            <Fragment></Fragment>
          )}
        </div>
      </div>
      <Fab color="blue darken-2" icon="fa fa-plus" data-target="compose" />
      <Compose id="compose" />
    </div>
  );
};

export default Inbox;
