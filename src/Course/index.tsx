import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {CourseEdit} from "./Edit/index";
import {CourseList} from "./List/index";

export class CourseRouter extends Component {
    render() {
        return <div>
            <Route path="/course/:id" exact={true} component={CourseEdit}/>
            <Route path="/course" exact={true} component={CourseList}/>
        </div>
    }
}
