import React, { Fragment } from "react";
import { Navbar } from "./components/layouts/Navbar";
import { Landing } from "./components/layouts/Landing";
import { Footer } from "./components/layouts/Footer";
import "./App.css";
import "./spacing.css";

const App = () => (
  <Fragment className="App">
    <Navbar />
    <Landing />
    <Footer />
  </Fragment>
);

export default App;
