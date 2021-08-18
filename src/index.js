import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/styles.scss";
import "./styles/btsp.scss";
import { ThemeProvider } from "./utilities/ThemeContext";

ReactDOM.render(
  <ThemeProvider>
    <Router>
      <App />
    </Router>
  </ThemeProvider>,
  document.getElementById("root")
);
