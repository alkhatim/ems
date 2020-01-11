import React from "react";

export const Navbar = () => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <a href="index.html">
          <i className="far fa-id-badge" />
          <span style={{ marginLeft: 7.5, fontSize: 25 }}>EMS</span>
        </a>
      </h1>
      <ul>
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
    </nav>
  );
};
