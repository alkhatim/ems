import React from "react";
import PropTypes from "prop-types";

export const FormInput = props => {
  const { name, error, label } = props;

  return (
    <div className="row">
      <div className="input-field">
        <input
          name={name}
          id={name}
          className={error ? "invalid" : ""}
          {...props}
        />
        <label htmlFor={name}>{label}</label>
        <span className="helper-text red-text left">{error}</span>
      </div>
    </div>
  );
};

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};
