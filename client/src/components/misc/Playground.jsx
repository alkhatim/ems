import React from "react";
import Dropdown from "./../shared/Dropdown";
import Autocomplete from "./../shared/Autocomplete";

export const Playground = () => {
  let selected = "";
  const handleSelect = id => {
    console.log(id);
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col s6 offset-s3">
            <Autocomplete
              selected={selected}
              onChose={handleSelect}
              label="Employee"
              lookup="Employee"
            />
          </div>
        </div>
        <div className="row">
          <div className="col s6 offset-s3">
            <Dropdown label="State" lookup="State" />
          </div>
        </div>
      </div>
    </div>
  );
};
