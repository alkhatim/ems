import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";

export const Navbar = () => {
  useEffect(() => {
    var sidenav = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenav, {});
  }, []);

  return (
    <Fragment>
      <div className="navbar-fixed">
        <nav className="teal darken-3 z-depth-3">
          <div className="nav-wrapper mx-4">
            <Link to="/" className="brand-logo">
              <i className="far fa-id-badge" />
              EMS
            </Link>
            <a href="!#" className="sidenav-trigger" data-target="mobile-nav">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li>
                <Link to="/register">Sign Up</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile SideNav */}

      <ul className="sidenav sidenav-close blue-grey darken-4" id="mobile-nav">
        <h3 className="mb-3 center">
          <Link to="/" className="teal-text ">
            EMS
          </Link>
        </h3>
        <li className="mb-1">
          <div className="divider blue-grey darken-2"></div>
        </li>
        <li>
          <Link to="/settings" className="white-text">
            Settings
          </Link>
        </li>
        <li>
          <Link to="/register" className="white-text">
            Sign Up
          </Link>
        </li>
        <li>
          <Link to="/login" className="white-text">
            Login
          </Link>
        </li>
      </ul>
    </Fragment>
  );
};
