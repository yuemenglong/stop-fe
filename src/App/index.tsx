import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {CourseRouter} from "../Course/index";

export class App extends Component {
    render() {
        return <div className="container">
            <switch>
                <Route path="/course" component={CourseRouter}/>
            </switch>
        </div>
    }
}

