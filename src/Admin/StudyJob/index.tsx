import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {StudyJobList} from "./List/index";
import {StudyJobStudentList} from "./StudentList/index";

export class StudyJobRouter extends Component {
    render() {
        return <div>
            <Route path="/study-job" exact={true} component={StudyJobList}/>
            <Route path="/study-job/:id" exact={true} component={StudyJobList}/>
            <Route path="/study-job/:id/student" component={StudyJobStudentList}/>
        </div>
    }
}

