import React from "react";
import PropTypes from "prop-types";
import defaultPic from "../../img/defaultProfile.png";

const Message = props => {
  const { message } = props;

  const date = new Date(message.date).toLocaleDateString();

  return (
    <li className="collection-item" style={{ cursor: "pointer" }}>
      <div className="row ml-0">
        <div className="col s9 valign-wrapper">
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
        <div className="col s3 mt-h">
          <span>{date}</span>
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
