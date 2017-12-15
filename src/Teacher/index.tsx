import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {CourseRouter} from "./Course/index";
import {StudentRouter} from "./Student/index";
import {ClazzRouter} from "./Clazz/index";
import {Link} from "react-router-dom";
import {CourseCategoryList} from "./CourseCategory/index";
import {StudyJobRouter} from "./StudyJob/index";
import {QuestionCategoryList} from "./QuestionCategory/index";
import {JVOID0} from "../def/data";
import {ajaxGet} from "../common/kit";

export class AdminRoute extends Component {
    render() {
        return <div className="container">
            <div>
                <Link to="/teacher/course">课程列表</Link>
                <Link to="/teacher/student">学生列表</Link>
                <Link to="/teacher/clazz">班级列表</Link>
                <Link to="/teacher/course-category">课程体系</Link>
                <Link to="/teacher/question-category">题目类型体系</Link>
                <Link to="/teacher/study-job">学习任务</Link>
            </div>
            <Route path="/teacher/course" component={CourseRouter}/>
            <Route path="/teacher/student" component={StudentRouter}/>
            <Route path="/teacher/clazz" component={ClazzRouter}/>
            <Route path="/teacher/course-category" component={CourseCategoryList}/>
            <Route path="/teacher/question-category" component={QuestionCategoryList}/>
            <Route path="/teacher/study-job" component={StudyJobRouter}/>
        </div>
    }
}

