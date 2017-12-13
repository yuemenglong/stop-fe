import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {CourseRouter} from "../Admin/Course/index";
import {StudentRouter} from "../Admin/Student/index";
import {ClazzRouter} from "../Admin/Clazz/index";
import {Link} from "react-router-dom";
import {CourseCategoryList} from "../Admin/CourseCategory/index";
import {StudyJobRouter} from "../Admin/StudyJob/index";
import {AdminRoute} from "../Admin/index";
import {UserRoute} from "../User/index";

export class App extends Component {
    render() {
        return <div className="container">
            <div>
                <Link to={`/course`}>管理</Link>
                <Link to={`/user/22`}>用户A</Link>
                <Link to={`/user/23`}>用户B</Link>
            </div>
            <switch>
                <Route path="/course" component={AdminRoute}/>
                <Route path="/student" component={AdminRoute}/>
                <Route path="/clazz" component={AdminRoute}/>
                <Route path="/course-category" component={AdminRoute}/>
                <Route path="/study-job" component={AdminRoute}/>
                <Route path="/user/:uid" component={UserRoute}/>
            </switch>
        </div>
    }
}

