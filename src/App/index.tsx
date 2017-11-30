import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {CourseRouter} from "../Course/index";
import {StudentRouter} from "../Student/index";
import {ClazzRouter} from "../Clazz/index";
import {Link} from "react-router-dom";

export class App extends Component {
    render() {
        return <div className="container">
            <div>
                <Link to="/course">课程列表</Link>
                <Link to="/student">学生列表</Link>
                <Link to="/clazz">班级列表</Link>
            </div>
            <switch>
                <Route path="/course" component={CourseRouter}/>
                <Route path="/student" component={StudentRouter}/>
                <Route path="/clazz" component={ClazzRouter}/>
            </switch>
        </div>
    }
}

