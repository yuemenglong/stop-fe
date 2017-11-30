import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {ClazzList} from "./List/index";
import {ClazzEdit} from "./Edit/index";
import {ClazzStudent} from "./Student/index";
import {ClazzStudentSelect} from "./Selector/index";

export class ClazzRouter extends Component {
    render() {
        return <div>
            <switch>
                <Route path="/clazz" exact={true} component={ClazzList}/>
                <Route path="/clazz/:id" exact={true} component={ClazzList}/>
                <Route path="/clazz/:id/student" component={ClazzStudent}/>
                <Route path="/clazz/:id/student/select" component={ClazzStudentSelect}/>
            </switch>
        </div>
    }
}

