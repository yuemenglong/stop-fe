import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {CourseRouter} from "../Admin/Course/index";
import {StudentRouter} from "../Admin/Student/index";
import {ClazzRouter} from "../Admin/Clazz/index";
import {Link} from "react-router-dom";
import {CourseCategoryList} from "../Admin/CourseCategory/index";
import {StudyJobRouter} from "../Admin/StudyJob/index";

export class App extends Component {
    render() {
        return <div className="container">
            <div>
                <Link to="/course">课程列表</Link>
                <Link to="/student">学生列表</Link>
                <Link to="/clazz">班级列表</Link>
                <Link to="/course-category">课程体系</Link>
                <Link to="/study-job">学习任务</Link>
            </div>
            <switch>
                <Route path="/course" component={CourseRouter}/>
                <Route path="/student" component={StudentRouter}/>
                <Route path="/clazz" component={ClazzRouter}/>
                <Route path="/course-category" component={CourseCategoryList}/>
                <Route path="/study-job" component={StudyJobRouter}/>
            </switch>
        </div>
    }
}

