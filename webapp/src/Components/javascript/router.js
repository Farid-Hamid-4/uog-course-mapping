import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Search from "./search";
import Query from "./query";
import history from "./history";

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Query} />
                    <Route path="/query" exact component={Query} />
                    <Route path="/search" exact component={Search} />
                </Switch>
            </Router>
        )
    }
}