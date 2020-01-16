import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";

export class Navbar extends Component {
  componentDidMount() {
    document.addEventListener("DOMContentLoaded", function() {
      var elems = document.querySelectorAll(".sidenav");
      M.Sidenav.init(elems, {});
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="navbar-fixed">
          <nav className="teal darken-3" style={{ minHeight: 70 }}>
            <div className="nav-wrapper mx5 ">
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

        <ul className="sidenav grey darken-4" id="mobile-nav">
          <div className="container">
            <h4 className="teal-text">EMS</h4>
          </div>
          <li>
            <div className="divider teal"></div>
          </li>
          <li>
            <a href="profiles.html" className="teal-text">
              Settings
            </a>
          </li>
          <li>
            <a href="register.html" className="teal-text">
              Register
            </a>
          </li>
          <li>
            <a href="login.html" className="teal-text">
              Login
            </a>
          </li>
        </ul>
      </React.Fragment>
    );
  }
}
