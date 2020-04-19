import React, { useEffect } from "react";
import PropTypes from "prop-types";
import M from "materialize-css/dist/js/materialize.min";

const DatePicker = props => {
  const { label, onSelect } = props;

  useEffect(() => {
    const datepicker = document.querySelectorAll(".datepicker");
    M.Datepicker.init(datepicker, {
      defaultDate: new Date(),
      showClearBtn: true,
      autoClose: true,
      onSelect
    });
  }, [onSelect]);

  return (
    <div className="input-field">
      <input name="datepicker" type="text" className="datepicker" />
      <label htmlFor="datepicker">{label}</label>
    </div>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string.isRequired
};

export default DatePicker;
