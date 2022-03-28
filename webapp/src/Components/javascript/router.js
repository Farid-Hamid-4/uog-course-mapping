import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { useState } from 'react';
import ReactFlow from 'react-flow-renderer';


import Search from "./search";
import Query from "./query";
import history from "./history";
import ProgramGraph from "./programGraph";
import MajorGraph from "./majorGraph";

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Query} />
                    <Route path="/query" exact component={Query} />
                    <Route path="/search" exact component={Search} />
                    <Route path="/programGraph" exact component={ProgramGraph} />
                    <Route path="/majorGraph" exact component={MajorGraph} />
                </Switch>
            </Router>
        )
    }
}