import React from "react";
import PageHeader from "./../../shared/PageHeader";
import defaultPic from "../../../img/defaultProfile.png";

const Employee = () => {
  return (
    <div className="row">
      <PageHeader
        title="Employee Info"
        color="blue-text text-darken-2"
        icon="fa fa-address-card"
        url="/employee"
      />
    </div>
  );
};

export default Employee;
