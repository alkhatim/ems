import React, { Fragment, useEffect } from "react";
import M from "materialize-css/dist/js/materialize.min.js";

export const Navbar = () => {
  useEffect(() => {
    M.AutoInit();
    // document.addEventListener("DOMContentLoaded", function() {
    //   var sidenav = document.querySelectorAll(".sidenav");
    //   M.Sidenav.init(sidenav, {});
    // });
  }, []);

  return (
    <Fragment>
      <div className="navbar-fixed">
        <nav className="teal darken-3">
          <div className="nav-wrapper mx-4">
            <a href="#!" className="brand-logo">
              <i className="far fa-id-badge" />
              EMS
            </a>
            <a href="#!" className="sidenav-trigger" data-target="mobile-nav">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              <li>
                <a href="profiles.html">Settings</a>
              </li>
              <li>
                <a href="register.html">Register</a>
              </li>
              <li>
                <a href="login.html">Login</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <ul className="sidenav blue-grey darken-4" id="mobile-nav">
        <h3 className="teal-text ml-2">EMS</h3>
        <li>
          <div className="divider blue-grey darken-2"></div>
        </li>
        <li>
          <a href="profiles.html" className="white-text">
            Settings
          </a>
        </li>
        <li>
          <a href="register.html" className="white-text">
            Register
          </a>
        </li>
        <li>
          <a href="login.html" className="white-text">
            Login
          </a>
        </li>
      </ul>
    </Fragment>
  );
};
