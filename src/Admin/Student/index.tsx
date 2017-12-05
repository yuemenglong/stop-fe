import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {StudentList} from "./List/index";

export class StudentRouter extends Component {
    render() {
        return <div>
            <Route path="/student" component={StudentList}/>
        </div>
    }
}

