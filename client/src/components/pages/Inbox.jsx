import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadInbox } from "../../actions/inboxActions";
import Message from "./../shared/Message";
import PageHeader from "../shared/PageHeader";

export const Inbox = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadInbox());
  }, [dispatch]);

  const { inbox } = useSelector(store => store.inboxReducer);

  return (
    <div className="row">
      <PageHeader
        title="Inbox"
        icon="fa fa-inbox"
        color="text-darken-2 blue"
        url="/inbox"
      />
      <div className="col s12 m3">
        <ul className="collection inbox-page">
          {inbox.reverse().map(message => (
            <Message message={message} key={message._id} />
          ))}
        </ul>
      </div>
      <div className="col m9 hide-on-small-only"></div>
    </div>
  );
};

export default Inbox;
