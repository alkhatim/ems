import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import getLookup from "./../../services/lookups";
import M from "materialize-css/dist/js/materialize.min.js";

const Dropdown = props => {
  const { label, lookup } = props;

  const [data, setData] = useState([]);

  const dropdown = document.querySelectorAll("select");
  M.FormSelect.init(dropdown, {});

  useEffect(() => {
    const fetchData = async () => {
      setData(await getLookup(lookup));
    };
    fetchData();
  }, [data, lookup]);

  return (
    <div className="row">
      <div className="input-field">
        <select {...props}>
          <option value=""></option>
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
