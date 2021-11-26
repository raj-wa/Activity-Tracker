import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import Activity from "./Component/Activity";
import Dashboard from "./screen/dashboard/dashboard"


const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Dashboard} />
            </Switch>
        </Router>
    );
};

export default Routes;