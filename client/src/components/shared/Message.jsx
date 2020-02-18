import React from "react";
import PropTypes from "prop-types";
import defaultPic from "../../img/defaultProfile.png";

const Message = props => {
  const { message, onMessageClick } = props;
  const date = new Date(message.date).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const time = new Date(message.date).toLocaleTimeString([], {
    timeStyle: "short"
  });

  const handleClick = () => {
    onMessageClick(message);
  };

  return (
    <li className="collection-item inbox-message" onClick={handleClick}>
      <div className="row">
        <div className="col l5 m9 s10 valign-wrapper">
          <img
            src={(message.from && message.from.avatar) || defaultPic}
            alt=""
            className="circle responsive-img img-30 mt-h"
          />
          <span className="ml-h mt-h bold-text grey-text text-darken-3">
            {message.from.username}
          </span>
        </div>
        <div className="col l7 mt-h right">
          <span className="bold-text fs-s grey-text text-darken-3 mr-h hide-on-med-and-down">
            {time}
          </span>
          <span className="bold-text fs-s grey-text text-darken-3 hide-on-med-and-down">
            {date}
          </span>
          {!message.read && (
            <span className="badge red white-text fs-xs">unread</span>
          )}
        </div>
      </div>
      <p className="bold-text grey-text text-darken-3">{message.subject}</p>
      <span className="truncate">{message.body}</span>
    </li>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
  onMessageClick: PropTypes.func.isRequired
};

export default Message;
