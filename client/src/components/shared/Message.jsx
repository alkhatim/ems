import React from "react";
import PropTypes from "prop-types";
import defaultPic from "../../img/defaultProfile.png";

const Message = props => {
  const { from, message } = props;

  return (
    <li className="collection-item" style={{ cursor: "pointer" }}>
      <div className="row ml-0 valign-wrapper">
        <img
          src={(from && from.avatar) || defaultPic}
          alt=""
          className="circle responsive-img"
          style={{
            width: "30px",
            height: "30px",
            marginTop: "0.5rem"
          }}
        />
        <span className="ml-h mt-h bold-text grey-text text-darken-2">
          {" "}
          {from.username}{" "}
        </span>
      </div>
      <p className="bold-text grey-text text-darken-2">{message.subject}</p>
      <span>{message.body}</span>
    </li>
  );
};

Message.propTypes = {
  from: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired
};

export default Message;
