import React from "react";
import Dropdown from "./../shared/Dropdown";
import Autocomplete from "./../shared/Autocomplete";

export const Playground = () => {
  const employeeId = "";
  const handleAutocomplete = id => {
    employeeId = id;
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col s6 offset-s3">
            <Autocomplete
              id={employeeId}
              onAutocomplete={handleAutocomplete}
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
