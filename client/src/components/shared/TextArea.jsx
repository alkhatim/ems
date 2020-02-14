import React from "react";
import PropTypes from "prop-types";

const TextArea = props => {
  const { name, label } = props;

  return (
    <div className="input-field">
      <textarea name={name} id={name} className="materialize-textarea" />
      <label htmlFor={name}>{label}</label>
    </div>
  );
};

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default TextArea;
