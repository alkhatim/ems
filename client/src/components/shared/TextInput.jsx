import React from "react";
import PropTypes from "prop-types";

const TextInput = props => {
  const { name, label, icon } = props;

  return (
    <div className="input-field">
      {icon && <i className={"prefix " + icon} />}
      <input name={name} id={name} type="text" {...props} />
      <label htmlFor={name}>{label}</label>
    </div>
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string
};

export default TextInput;
