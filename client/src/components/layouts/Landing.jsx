import React from "react";

export const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay white-text">
        <div className="landing-inner row center valign-wrapper">
          <div className="col s12">
            <h1>EMS</h1>
            <p className="flow-text">Manage employees' data and salaries</p>
            <a
              href="!#"
              className="btn btn-large teal darken-2 waves-effect mr-1"
            >
              Sign Up
            </a>
            <a href="!#" className="btn btn-large teal waves-effect pulse">
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
