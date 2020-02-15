import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import defaultPic from "../../../img/defaultProfile.png";

const MessageView = props => {
  const { message } = props;
  const date = new Date(message.date).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const time = new Date(message.date).toLocaleTimeString([], {
    timeStyle: "short"
  });

  const deadline = new Date(message.deadline).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="mx-4 my-1">
      <div className="row">
        <div className="col s9 valign-wrapper">
          <img
            src={(message.from && message.from.avatar) || defaultPic}
            alt=""
            className="circle responsive-img"
            style={{
              width: "40px",
              height: "40px",
              marginTop: "0.5rem"
            }}
          />
          <span className="ml-h mt-h bold-text">{message.from.username}</span>
        </div>
        <div className="col s3">
          <div className="row mt-1">
            <span className="grey-text text-darken-3 bold-text">
              Sent :&nbsp;
            </span>
            <span className="grey-text text-darken-3 bold-text mr-h">
              {time}
            </span>
            <span className="grey-text text-darken-3 bold-text">{date}</span>
          </div>
        </div>
      </div>
      <div className="row bold-text mt-2">
        <div className="col s9">Subject : {message.subject}</div>
        <div className="col s3">
          {message.deadline && (
            <div>
              <span className="red-text">Deadline :&nbsp;</span>
              <span className="grey-text text-darken-3">{deadline}</span>
            </div>
          )}
        </div>
      </div>
      <div className="divider"></div>
      <div className="row mt-4">{message.body}</div>
      {message.url && (
        <div className="row mt-2 bold-text">
          <Link to={message.url} className="url">
            URL :&nbsp;&nbsp;..{message.url}
          </Link>
        </div>
      )}

      {/* Add attachments here */}
    </div>
  );
};

MessageView.propTypes = {
  message: PropTypes.object.isRequired
};

export default MessageView;
