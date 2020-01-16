import React from "react";

export const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay white-text">
        <div className="container">
          <div className="row center">
            <div className="col s12">
              <h1>EMS</h1>
              <p className="flow-text">Manage employees' data and salaries</p>
            </div>
          </div>
          <div className="row center ">
            <div className="col s6">
              <a href="#!" className="btn teal darken-2 waves-effect">
                Sign Up
              </a>
            </div>
            <div className="col s6">
              <a href="#!" className="btn teal darken-2 waves-effect">
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
