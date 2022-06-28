import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
// styles from Now UI template
import "./assets/styles/bootstrap.min.css";
import "./assets/scss/now-ui-kit.css";

import "./assets/demo/demo.css";
import "./assets/demo/react-demo.css";
import "./assets/demo/nucleo-icons-page-styles.css";

// styles from Notus template
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/styles/tailwind.min.css";
import "./assets/styles/docs.css";

// // custom
import CromeContracts from "./views/custom/CromeContracts";


ReactDOM.render(
  <HashRouter>
    <Switch>

      {/* Custom Routes added */}
      <Route exact path="/:id" render={(props) => ( <CromeContracts />)} />

      <Redirect from="*" to="/index" />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);