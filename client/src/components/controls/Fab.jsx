import React from "react";
import PropTypes from "prop-types";

const Fab = props => {
  const { color, icon } = props;

  return (
    <div className="fixed-action-btn mb-1 mr-1">
      <button
        className={"modal-trigger btn-floating btn-large " + color}
        {...props}
      >
        <i className={icon}></i>
      </button>
    </div>
  );
};

Fab.propTypes = {
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default Fab;
