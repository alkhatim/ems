import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = props => {
  const { path, component: Component, render, ...rest } = props;
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const user = useSelector(state => state.authReducer.user);
  const isAdmin = isLoggedIn && user.role === "admin";

  return (
    <Route
      {...rest}
      render={props => {
        if (!isAdmin)
          return (
            <Redirect
              to={{
                pathname: "/unAuthorized",
                state: { from: props.location }
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default PrivateRoute;
