import React, { Fragment } from "react";
import { Navbar } from "./components/layouts/Navbar";
import { Landing } from "./components/layouts/Landing";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.css";
// import "materialize-css/dist/css/materialize.css";

const App = () => (
  <Fragment className="App">
    <Navbar />
    <Landing />
  </Fragment>
);

export default App;
