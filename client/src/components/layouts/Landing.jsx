import React from "react";

export const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay white-text">
        <div
          className="row container center valign-wrapper"
          style={{ minHeight: "90vh" }}
        >
          <div className="col s12">
            <h1>EMS</h1>
            <p className="flow-text">Manage employees' data and salaries</p>
            <a
              href="#!"
              className="btn btn-large teal darken-3 waves-effect mr-1"
            >
              Sign Up
            </a>
            <a href="#!" className="btn btn-large teal darken-1 waves-effect">
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
