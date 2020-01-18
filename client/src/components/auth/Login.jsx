import React, { Fragment } from "react";

export const Login = () => {
  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <h1 className="center teal-text">Login</h1>
          <div className="col s6 offset-s3 card">
            <div className="card-content">
              <form>
                <div className="input-field">
                  <input
                    type="text"
                    name="username"
                    id="name"
                    className="validtae"
                  />
                  <label for="username">Usernmae</label>
                </div>
                <div className="input-field">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="validtae"
                  />
                  <label for="password">Password</label>
                </div>
                <div className="input-field center">
                  <button type="submit" className="btn btn-large">
                    Log In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
