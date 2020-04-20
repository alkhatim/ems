import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";
import { loadUser } from "./actions/authActions";
import ProtectedRoute from "./components/misc/ProtectedRoute";
import PrivateRoute from "./components/misc/PrivateRoute";
import Navbar from "./components/pages/Layouts/Navbar";
import Landing from "./components/pages/Layouts/Landing";
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import Dashboard from "./components/pages/Layouts/Dashboard";
import Inbox from "./components/pages/Inbox/Inbox";
import Employees from "./components/pages/Employees/Employees";
import Employee from "./components/pages/Employees/Employee";
import Playground from "./components/pages/Layouts/Playground";
import Forbidden from "./components/pages/Auth/Forbidden";
import NotFound from "./components/pages/Layouts/NotFound";
import LoadingOverlay from "react-loading-overlay";
import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";
import "materialize-css/dist/css/materialize.min.css";
import "./App.css";
import "./common.css";

const App = () => {
  store.dispatch(loadUser());
  const loading = store.getState().appReducer.loading;

  return (
    <Provider store={store}>
      <LoadingOverlay
        active={loading}
        spinner={<ClipLoader size={110} color="teal" />}
      >
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/register" component={Register} />
            <ProtectedRoute exact path="/dashboard" component={Dashboard} />
            <ProtectedRoute exact path="/inbox" component={Inbox} />
            <ProtectedRoute exact path="/employees" component={Employees} />
            <ProtectedRoute exact path="/employee/:id?" component={Employee} />
            <Route exact path="/playground" component={Playground} />
            <Route exact path="/forbidden" component={Forbidden} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </LoadingOverlay>
      <ToastContainer pauseOnFocusLoss={false} />
    </Provider>
  );
};

export default App;
