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

export class AdminRoute extends Component {
    render() {
        return <div className="container">
            <div>
                <Link to="/course">课程列表</Link>
                <Link to="/student">学生列表</Link>
                <Link to="/clazz">班级列表</Link>
                <Link to="/course-category">课程体系</Link>
                <Link to="/question-category">题目类型体系</Link>
                <Link to="/study-job">学习任务</Link>
            </div>
            <Route path="/course" component={CourseRouter}/>
            <Route path="/student" component={StudentRouter}/>
            <Route path="/clazz" component={ClazzRouter}/>
            <Route path="/course-category" component={CourseCategoryList}/>
            <Route path="/question-category" component={QuestionCategoryList}/>
            <Route path="/study-job" component={StudyJobRouter}/>
        </div>
    }
}

