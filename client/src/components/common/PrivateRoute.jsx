import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = props => {
  const { path, component: Component, ...rest } = props;
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const isLoading = useSelector(state => state.authReducer.isLoading);
  const user = useSelector(state => state.authReducer.user);
  const isAdmin = isLoggedIn && user.role === "admin";

  return (
    <Route
      {...rest}
      render={props =>
        !isLoading && !isAdmin ? (
          <Redirect
            to={{
              pathname: "/unAuthorized",
              state: { from: props.location }
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
