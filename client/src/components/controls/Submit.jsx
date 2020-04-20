import React from "react";
import PropTypes from "prop-types";

const Submit = ({ label, icon }) => {
  return (
    <div className="input-field">
      <button type="submit" className="btn btn-large">
        {label}
        <i className={icon} />
      </button>
    </div>
  );
};

Submit.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string
};

export default Submit;
