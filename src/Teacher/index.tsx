import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {CourseRouter} from "./Course/index";
import {StudentList} from "./Student/index";
import {ClazzRouter} from "./Clazz/index";
import {Link} from "react-router-dom";
import {StudyJobRouter} from "./StudyJob/index";
import {JVOID0} from "../def/data";
import {ajaxGet} from "../common/kit";
import {LoginPage} from "../Page/Login/index";
import {QuizRouter} from "./Quiz/index";

export class TeacherApp extends Component {
    render() {
        return <div className="container">
            <div>
                <Link to="/teacher/course">课程列表</Link>
                <Link to="/teacher/student">学生列表</Link>
                <Link to="/teacher/clazz">班级列表</Link>
                <Link to="/teacher/study-job">学习任务</Link>
                <Link to="/teacher/quiz">考试任务</Link>
            </div>
            <switch>
                <Route path="/teacher/course" component={CourseRouter}/>
                <Route path="/teacher/student" component={StudentList}/>
                <Route path="/teacher/clazz" component={ClazzRouter}/>
                <Route path="/teacher/study-job" component={StudyJobRouter}/>
                <Route path="/teacher/quiz" component={QuizRouter}/>
                <Route path="/login" component={LoginPage}/>
            </switch>
        </div>
    }
}

