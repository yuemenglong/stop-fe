import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {StudyJobList} from "./List/index";

export class StudyJobRouter extends Component {
    render() {
        return <div>
            <Route path="/study-job" component={StudyJobList}/>
        </div>
    }
}

