import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {StudentList} from "./List/index";
import {StudentEdit} from "./Edit/index";

export class StudentRouter extends Component {
    render() {
        return <div>
            <Route path="/student" component={StudentList}/>
            <Route path="/student/:id" component={StudentEdit}/>
        </div>
    }
}

