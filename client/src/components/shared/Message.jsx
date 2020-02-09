import React from "react";
import PropTypes from "prop-types";
import defaultPic from "../../img/defaultProfile.png";

const Message = props => {
  const { message } = props;

  const date = new Date(message.date).toLocaleDateString();
  const time = new Date(message.date).toLocaleTimeString([], {
    timeStyle: "short"
  });

  return (
    <li className="collection-item inbox-message">
      <div className="row ml-0">
        <div className="col s6 valign-wrapper">
          <img
            src={(message.from && message.from.avatar) || defaultPic}
            alt=""
            className="circle responsive-img"
            style={{
              width: "30px",
              height: "30px",
              marginTop: "0.5rem"
            }}
          />
          <span className="ml-h mt-h bold-text grey-text text-darken-2">
            {message.from.username}
          </span>
        </div>
        <div className="col s6 mt-h">
          <span
            className="bold-text grey-text text-darken-2 mr-1"
            style={{ fontSize: 12 }}
          >
            {time}
          </span>
          <span
            className="grey-text text-darken-2"
            style={{ fontSize: 12, fontWeight: "bold" }}
          >
            {date}
          </span>
          {!message.seen && (
            <span className="badge red white-text" style={{ fontSize: 10 }}>
              unread
            </span>
          )}
        </div>
      </div>
      <p className="bold-text grey-text text-darken-2">{message.subject}</p>
      <span className="truncate">{message.body}</span>
    </li>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired
};

export default Message;
