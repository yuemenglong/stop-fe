import {Component} from "react";
import * as React from "react";
import {ajaxGet} from "../common/kit";
import {CourseRouter} from "./Course/index";
import {StudentList} from "./Student/index";
import {ClazzRouter} from "./Clazz/index";
import {StudyJobRouter} from "./StudyJob/index";
import {QuizRouter} from "./Quiz/index";
import {TeacherLogin} from "./TeacherLogin/index";
import {_teacherLeftCon} from "../common/common-method";
import {LeftSideClass} from "../component/LeftSide/index";
import {HeadMenu} from "../component/HeadMenu/index";
import {Route} from "react-router";
import '../common/style.less';

export class TeacherApp extends Component {
    onLogout() {
        ajaxGet(`/teacher/logout`, () => {
            location.href = `/login`
        })
    }

    render() {
        return <div className="container common-container">
            {/*<div>*/}
            {/*<Link to="/teacher/course">课程列表</Link>*/}
            {/*<Link to="/teacher/student">学生列表</Link>*/}
            {/*<Link to="/teacher/clazz">班级列表</Link>*/}
            {/*<Link to="/teacher/study-job">学习任务</Link>*/}
            {/*<Link to="/teacher/quiz">考试任务</Link>*/}
            {/*</div>*/}
            <HeadMenu onLogout={this.onLogout.bind(this)} logo={'老师攻防平台'}/>
            <div className={'common-left-side'}>
                <LeftSideClass cons={_teacherLeftCon}/>
            </div>
            <switch className={'common-right-con'}>
                <Route path="/teacher/course" component={CourseRouter}/>
                <Route path="/teacher/student" component={StudentList}/>
                <Route path="/teacher/clazz" component={ClazzRouter}/>
                <Route path="/teacher/study-job" component={StudyJobRouter}/>
                <Route path="/teacher/quiz" component={QuizRouter}/>
                <Route path="/login" component={TeacherLogin}/>
            </switch>
        </div>
    }
}

