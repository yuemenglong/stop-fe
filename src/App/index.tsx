import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {PageIndex} from "../Page/Index/index";
import {CourseList} from "../Course/List/index";
import {CourseRouter} from "../Course/index";
import {StudentRouter} from "../Student/index";

export class App extends Component {
    render() {
        return <div className="container">
            <switch>
                <Route path="/course" component={CourseRouter}/>
                <Route path="/student" component={StudentRouter}/>
                <Route path="/" exact={true} component={PageIndex}/>
            </switch>
        </div>
    }
}

