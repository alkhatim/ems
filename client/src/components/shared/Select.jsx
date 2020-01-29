import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import getLookup from "../../services/lookups";
import { Dropdown } from "primereact/dropdown";

const Select = props => {
  const [data, setData] = useState([]);
  const { label, lookup } = props;

  useEffect(() => {
    const fetchData = async () => {
      setData(await getLookup(lookup));
    };
    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="input-field">
        <Dropdown
          optionLabel="name"
          options={data}
          placeholder={label}
          showClear={true}
          {...props}
        />
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  lookup: PropTypes.string.isRequired
};

export default Select;
