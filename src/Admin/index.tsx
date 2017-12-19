import * as React from "react";
import {Component} from "react";
import {Redirect, Route, RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {JVOID0} from "../def/data";
import {AdminLogin} from "./AdminLogin/index";
import {ajaxGet} from "../common/kit";
import {CategoryList} from "./Category/index";

export class AdminApp extends Component {
    renderNavs() {
        let logout = () => {
            ajaxGet(`/admin/logout`, () => {
                location.href = `/login`
            })
        };
        return <div>
            <Link to={`/admin/course-category`}>课程体系</Link>
            <Link to={`/admin/courseware-category`}>课件体系</Link>
            <Link to={`/admin/video-category`}>视频体系</Link>
            <Link to={`/admin/question-category`}>题目体系</Link>
            <a href={JVOID0} onClick={logout}>注销</a>
        </div>
    }

    render() {
        let courseCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="course"/>;
        let coursewareCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="courseware"/>;
        let videoCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="video"/>;
        let questionCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="question"/>;
        return <div className="container">
            {this.renderNavs()}
            <switch>
                <Route path="/admin/course-category" exact={true} render={courseCagetory}/>
                <Route path="/admin/courseware-category" exact={true} render={coursewareCagetory}/>
                <Route path="/admin/video-category" exact={true} render={videoCagetory}/>
                <Route path="/admin/question-category" exact={true} render={questionCagetory}/>
                <Route path="/login" exact={true} component={AdminLogin}/>
                <Route path="/" exact={true} render={() => <Redirect to="/admin/course-category"/>}/>
            </switch>
        </div>
    }
}

