import React from "react";
import PropTypes from "prop-types";
import defaultPic from "../../img/defaultProfile.png";

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
          <span className="ml-h mt-h bold-text grey-text text-darken-2">
            {message.from.username}
          </span>
        </div>
        <div className="col s3">
          <span className="bold-text fs-s grey-text text-darken-2  mr-h hide-on-med-and-down">
            {time}
          </span>
          <span className="bold-text fs-s grey-text text-darken-2 hide-on-med-and-down">
            {date}
          </span>
        </div>
      </div>
    </div>
  );
};

MessageView.propTypes = {
  message: PropTypes.object.isRequired
};

export default MessageView;
