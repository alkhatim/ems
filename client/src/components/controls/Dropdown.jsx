import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import getLookup from "./../../services/lookups";
import M from "materialize-css/dist/js/materialize.min.js";

const Dropdown = props => {
  const { label, lookup } = props;

  const [data, setData] = useState([]);

  const fetchData = async () => {
    setData(await getLookup(lookup));
  };

  useEffect(() => {
    var dropdown = document.querySelectorAll("select");
    M.FormSelect.init(dropdown, {});
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="row">
      <div className="input-field">
        <select defaultValue={""} {...props}>
          <option value="" disabled></option>
          {data.map(item => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        <label>{label}</label>
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  lookup: PropTypes.string.isRequired
};

export default Dropdown;
