import * as React from "react";
import {Component} from "react";
import {Route} from "react-router";
import {Link} from "react-router-dom";
import {TeacherApp} from "../Teacher/index";
import {UserApp} from "../User/index";
import {LoginPage} from "../Page/Login/index";
import {ajaxGet} from "../common/kit";
import {JVOID0} from "../def/data";

export class App extends Component {
    render() {
        let logout = () => {
            ajaxGet(`/user/logout`, () => {
                location.href = `/login`
            })
        };
        return <div className="container">
            <div>
                <Link to={`/course`}>管理</Link>
                <Link to={`/user/22`}>用户A</Link>
                <Link to={`/user/23`}>用户B</Link>
                <a href={JVOID0} onClick={logout}>注销</a>
            </div>
            <switch>
                <Route path="/course" component={TeacherApp}/>
                <Route path="/student" component={TeacherApp}/>
                <Route path="/clazz" component={TeacherApp}/>
                <Route path="/course-category" component={TeacherApp}/>
                <Route path="/question-category" component={TeacherApp}/>
                <Route path="/study-job" component={TeacherApp}/>
                <Route path="/user/:uid" component={UserApp}/>
                <Route path="/login" component={LoginPage}/>
            </switch>
        </div>
    }
}

