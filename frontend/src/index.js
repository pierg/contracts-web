import React from "react";
import { HashRouter, Route } from "react-router-dom";
// styles from Now UI template
import "./assets/styles/bootstrap.min.css";
import "./assets/scss/now-ui-kit.css";



// styles from Notus template
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/styles/tailwind.min.css";
import "./assets/styles/tailwind.css";
import "./assets/styles/docs.css";
import "./assets/styles/custom.css"

// // custom
import CustomDashboard from "./views/custom/CustomDashboard";
import {Navigate, Routes} from "react-router";
import ReactDOM from "react-dom/client";
//
// ReactDOM.render(
//   <HashRouter>
//     <Switch>
//
//       {/* Custom Routes added */}
//       <Route exact path="/:id" render={(props) => ( <CustomDashboard page={props.match.params.id}/>)} />
//
//       <Redirect from="*" to="/index" />
//     </Switch>
//   </HashRouter>,
//   document.getElementById("root")
// );

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <HashRouter>
        <Routes>

            <Route path="/:id" element={<CustomDashboard/>}/>
            <Route path="*" element={<Navigate to="index"/>}/>


        </Routes>
    </HashRouter>
);
