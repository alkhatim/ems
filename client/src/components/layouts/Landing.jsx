import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Footer } from "./Footer";

export const Landing = () => {
  return (
    <Fragment>
      <section className="landing">
        <div className="dark-overlay white-text">
          <div className="landing-inner row center valign-wrapper">
            <div className="col s12">
              <h1>EMS</h1>
              <p className="flow-text">Manage employees' data and salaries</p>
              <Link
                to="/register"
                className="btn btn-large teal darken-2 waves-effect mr-1"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="btn btn-large teal waves-effect pulse"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </Fragment>
  );
};
