import React from "react";
import PropTypes from "prop-types";

const Submit = ({ label }) => {
  return (
    <div className="input-field">
      <button type="submit" className="btn btn-large">
        {label}
      </button>
    </div>
  );
};

Submit.propTypes = {
  label: PropTypes.string.isRequired
};

export default Submit;
