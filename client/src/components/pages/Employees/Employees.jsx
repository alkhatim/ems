import React from "react";
import PageHeader from "./../../shared/PageHeader";
import defaultPic from "../../../img/defaultProfile.png";

const Employees = () => {
  return (
    <div className="row">
      <PageHeader
        title="Employees"
        color="blue-text text-darken-2"
        icon="fa fa-address-book"
        url="/employees"
      />
    </div>
  );
};

export default Employees;
