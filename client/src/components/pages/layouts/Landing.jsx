import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import Footer from "./Footer";

export const Landing = () => {
  const isLoggedIn = useSelector((store) => store.authReducer.isLoggedIn);

  if (isLoggedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <section className="landing">
        <div className="dark-overlay white-text">
          <div className="landing-inner row center valign-wrapper">
            <div className="col s12">
              <h1>EMS</h1>
              <p className="flow-text">Manage employees' data and salaries</p>
              <Link
                to="/about"
                className="btn btn-large teal darken-2 waves-effect mr-1"
              >
                About
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

export default Landing;
