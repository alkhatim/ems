import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logOut } from "../../actions/authActions";
import profilePicture from "../../img/profile.png";
import M from "materialize-css/dist/js/materialize.min.js";

export const Navbar = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const user = useSelector(state => state.authReducer.user);

  useEffect(() => {
    var sidenav = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenav, {});
    var profileDropdown = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(profileDropdown, { coverTrigger: false });
  }, []);

  const onLogOut = () => {
    dispatch(logOut());
  };

  return (
    <Fragment>
      <div className="navbar-fixed">
        <nav className="teal darken-3 z-depth-3">
          <div className="nav-wrapper ml-4 mr-2">
            <Link to="/" className="brand-logo">
              <i className="far fa-id-badge" />
              EMS
            </Link>
            <a href="!#" className="sidenav-trigger" data-target="mobile-nav">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              {isLoggedIn && user.role === "admin" && (
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
              )}
              {!isLoggedIn && (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <img
                    src={(user && user.avatar) || profilePicture}
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
              )}
            </ul>
          </div>
        </nav>
      </div>

      {/* Profile Dropdown */}
      <ul className="dropdown-content" id="profile-dropdown">
        <li>
          <Link to="/" onClick={onLogOut}>
            Log out
          </Link>
        </li>
      </ul>

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
        {isLoggedIn && (
          <li>
            <Link to="/settings" className="white-text">
              Settings
            </Link>
          </li>
        )}
        {!isLoggedIn && (
          <li>
            <Link to="/login" className="white-text">
              Login
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <Link to="/profile" className="white-text">
              profile
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <Link to="/" onClick={onLogOut} className="white-text">
              Log out
            </Link>
          </li>
        )}
      </ul>
    </Fragment>
  );
};
