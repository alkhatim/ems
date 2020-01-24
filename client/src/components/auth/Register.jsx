import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../actions/authActions";

export const Register = () => {
  const [formData, setformData] = useState({
    username: "",
    password: "",
    password2: "",
    avatar: "",
    isAdmin: false
  });

  const { username, password, password2, avatar, isAdmin } = formData;

  const dispatch = useDispatch();

  const onChange = e => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCheck = e => {
    setformData({
      ...formData,
      [e.target.name]: e.target.checked ? true : false
    });
  };

  const onUpload = e => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setformData({ ...formData, avatar: reader.result });
    };
  };

  const onSubmit = e => {
    e.preventDefault();
    dispatch(register(username, password, avatar, isAdmin));
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row center">
          <h1 className="center teal-text mt-4 mb-2">Register</h1>
          <p className="flow-text teal-text">
            <i className="fas fa-sign-in-alt mr-1 mb-1"></i> Register an account
            for a new user
          </p>
          <div className="col s6 offset-s3 card">
            <div className="card-content">
              <form onSubmit={onSubmit}>
                <div className="input-field">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={onChange}
                    className="validate"
                    required
                  />
                  <label htmlFor="username">Usernmae</label>
                </div>
                <div className="input-field">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={onChange}
                    className="validate"
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="input-field">
                  <input
                    type="password"
                    name="password2"
                    id="password2"
                    value={password2}
                    onChange={onChange}
                    className="validate"
                    required
                  />
                  <label htmlFor="password2">Confirm Password</label>
                </div>
                <div className="file-field input-field">
                  <div className="btn yellow darken-2">
                    <span>Avatar</span>
                    <input type="file" onChange={onUpload} />
                  </div>
                  <div className="file-path-wrapper">
                    <input
                      className="file-path"
                      type="text"
                      placeholder="Upload an account avatar"
                    />
                  </div>
                </div>
                <div className="input-field my-2">
                  <p>
                    <label>
                      <input
                        type="checkbox"
                        name="isAdmin"
                        id="isAdmin"
                        onChange={onCheck}
                        className="filled-in"
                      />
                      <span>Admin Account</span>
                    </label>
                  </p>
                </div>

                <div className="input-field">
                  <button type="submit" className="btn btn-large">
                    Register
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
