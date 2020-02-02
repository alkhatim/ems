import React from "react";
import Dropdown from "./../shared/Dropdown";
import Autocomplete from "./../shared/Autocomplete";

export const Playground = () => {
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col s6 offset-s3">
            <Autocomplete label="Employee" lookup="Employee" />
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
