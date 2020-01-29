import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";
import { loadUser } from "./actions/authActions";
import ProtectedRoute from "./components/misc/ProtectedRoute";
import PrivateRoute from "./components/misc/PrivateRoute";
import { Navbar } from "./components/layouts/Navbar";
import { Landing } from "./components/layouts/Landing";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Dashboard } from "./components/layouts/Dashboard";
import { Playground } from "./components/misc/Playground";
import { Forbidden } from "./components/auth/Forbidden";
import { NotFound } from "./components/misc/NotFound";
import "react-toastify/dist/ReactToastify.css";
import "materialize-css/dist/css/materialize.min.css";
import "./App.css";
import "./spacing.css";

const App = () => {
  store.dispatch(loadUser());

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/register" component={Register} />
          <ProtectedRoute exact path="/dashboard" component={Dashboard} />
          <Route exact path="/playground" component={Playground} />
          <Route exact path="/forbidden" component={Forbidden} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
      <ToastContainer pauseOnFocusLoss={false} />
    </Provider>
  );
};

export default App;
