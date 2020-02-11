import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadInbox, readMessage } from "../../actions/inboxActions";
import Message from "./../shared/Message";
import MessageView from "../shared/MessageView";
import PageHeader from "../shared/PageHeader";
import defaultPic from "../../img/defaultProfile.png";

export const Inbox = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadInbox());
  }, [dispatch]);

  const { inbox } = useSelector(store => store.inboxReducer);

  const handleMessageSelect = message => {
    setSelectedMessage(message);
    if (message.read === false) dispatch(readMessage(message._id));
  };

  return (
    <div className="row">
      <PageHeader
        title="Inbox"
        icon="fa fa-inbox"
        color="text-darken-2 blue"
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
    </div>
  );
};

export default Inbox;
