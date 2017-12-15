import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {ClazzList} from "./List/index";
import {ClazzStudent} from "./Student/index";

export class ClazzRouter extends Component {
    render() {
        return <div>
            <switch>
                <Route path="/teacher/clazz" exact={true} component={ClazzList}/>
                <Route path="/teacher/clazz/:id/student" component={ClazzStudent}/>
            </switch>
        </div>
    }
}

