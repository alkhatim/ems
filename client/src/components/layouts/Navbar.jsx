import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logOut } from "../../actions/authActions";
import defaultPic from "../../img/defaultProfile.png";
import M from "materialize-css/dist/js/materialize.min.js";

export const Navbar = () => {
  const dispatch = useDispatch();

  const { user, isLoggedIn } = useSelector(store => store.authReducer);

  useEffect(() => {
    var sidenav = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenav, {});
    var profileDropdown = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(profileDropdown, {
      coverTrigger: false,
      constrainWidth: false
    });
  }, []);

  const handleLogOut = () => {
    dispatch(logOut());
  };

  return (
    <Fragment>
      {/* Fixed Nav */}
      <div className="navbar-fixed">
        <nav className="teal darken-2 z-depth-2">
          <div className="nav-wrapper ml-4 mr-2">
            <Link to="/" className="brand-logo">
              <i className="far fa-id-badge app-icon" />
              EMS
            </Link>
            <a href="#!" className="sidenav-trigger" data-target="mobile-nav">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              {!isLoggedIn && (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <Link to="/inbox">Inbox</Link>
                </li>
              )}
              {isLoggedIn && user.role === "admin" && (
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
              )}
              <li className={isLoggedIn ? "" : "hide"}>
                <img
                  src={(user && user.avatar) || defaultPic}
                  alt=""
                  className="circle responsive-img dropdown-trigger"
                  data-target="profile-dropdown"
                  style={{
                    width: "40px",
                    height: "40px",
                    marginTop: "0.75rem",
                    marginLeft: "0.4rem"
                  }}
                />
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Profile Dropdown */}
      <ul className="dropdown-content" id="profile-dropdown">
        <li>
          <Link to="/profile">
            <i className="fa fa-user-circle mr-1"></i>Profile
          </Link>
        </li>
        <li>
          <Link to="/" onClick={handleLogOut}>
            <i className="fa fa-sign-out mr-1"></i>Log out
          </Link>
        </li>
      </ul>

      {/* Mobile SideNav */}
      <ul className="sidenav sidenav-close blue-grey darken-4" id="mobile-nav">
        <h3 className="mb-3 center">
          <Link to="/" className="teal-text ">
            <i className="far fa-id-badge teal-text" /> EMS
          </Link>
        </h3>
        <li className="mb-1">
          <div className="divider blue-grey darken-2"></div>
        </li>
        {!isLoggedIn && (
          <li>
            <Link to="/login" className="white-text">
              <i className="fa fa-sign-in white-text"></i>Login
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <Link to="/inbox" className="white-text">
              <i className="fas fa-envelope white-text"></i>Inbox
            </Link>
          </li>
        )}
        {isLoggedIn && user.role === "admin" && (
          <li>
            <Link to="/settings" className="white-text">
              <i className="fa fa-gear white-text"></i>Settings
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <Link to="/profile" className="white-text">
              <i className="fa fa-user-circle white-text"></i>Profile
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <Link to="/" onClick={handleLogOut} className="white-text">
              <i className="fa fa-sign-out white-text"></i>Log out
            </Link>
          </li>
        )}
      </ul>
    </Fragment>
  );
};

export default Navbar;
