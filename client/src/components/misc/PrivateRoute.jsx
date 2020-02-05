import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = props => {
  const { path, component: Component, ...rest } = props;
  const isLoggedIn = useSelector(store => store.authReducer.isLoggedIn);
  const isLoading = useSelector(store => store.authReducer.isLoading);
  const user = useSelector(store => store.authReducer.user);
  const isAdmin = isLoggedIn && user.role === "admin";

  return (
    <Route
      {...rest}
      render={props =>
        !isLoading && !isAdmin ? (
          <Redirect
            to={{
              pathname: "/forbidden",
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
