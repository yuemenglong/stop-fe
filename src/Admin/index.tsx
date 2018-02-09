import * as React from "react";
import {Component} from "react";
import {Redirect, Route} from "react-router";
import {Link} from "react-router-dom";
import {JVOID0} from "../def/data";
import {AdminLogin} from "./AdminLogin/index";
import {ajaxGet} from "../common/kit";
import {CategoryList} from "./Category/index";
import {CoursewareList} from "./Courseware/index";
import {QuestionList} from "./Question/index";
import {VideoList} from "./Video/index";
import {HeadMenu} from "../component/HeadMenu/index";
import {TargetList} from "./Target/index";
import './style.less';
import {LeftSideClass} from "../component/LeftSide/index";

export class AdminApp extends Component {
    renderNavs() {
        let logout = () => {
            ajaxGet(`/admin/logout`, () => {
                location.href = `/login`
            })
        };
        // return <div>
        //     <Link to={`/admin/course-category`}>课程体系</Link>
        //     <Link to={`/admin/courseware-category`}>课件体系</Link>
        //     <Link to={`/admin/video-category`}>视频体系</Link>
        //     <Link to={`/admin/question-category`}>题目体系</Link>
        //     <Link to={`/admin/target-category`}>靶场体系</Link>
        //     <Link to={`/admin/courseware`}>课件</Link>
        //     <Link to={`/admin/video`}>视频</Link>
        //     <Link to={`/admin/question`}>题目</Link>
        //     <Link to={`/admin/target`}>靶场</Link>
        //     <a href={JVOID0} onClick={logout}>注销</a>
        // </div>
        let adminCons = [
            {name: '课程体系', url: '/admin/course-category', iconClass: 'fa fa-book'},
            {
                name: '课件体系', iconClass: 'fa fa-laptop',
                values: [{name: '体系', url: '/admin/courseware-category'}, {name: '课件', url: '/admin/courseware'}]
            },
            {
                name: '视频体系', iconClass: "fa fa-play-circle",
                values: [{name: '体系', url: '/admin/video-category'}, {name: '视频', url: '/admin/video'}]
            },
            {
                name: '题目体系', iconClass: 'fa fa-newspaper-o',
                values: [{name: '体系', url: '/admin/question-category'}, {name: '题目', url: '/admin/question'}]
            },
            {
                name: '靶场体系', iconClass: 'fa fa-bullseye',
                values: [{name: '体系', url: '/admin/target-category'}, {name: '靶场题目', url: '/admin/target'}]
            }
        ];
        return <div className={'admin-side'}>
            <LeftSideClass cons={adminCons}/>
        </div>
    }

    render() {
        let courseCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="course"/>;
        let coursewareCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="courseware"/>;
        let videoCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="video"/>;
        let questionCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="question"/>;
        let targetCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="target"/>;
        return <div className="container">
            <HeadMenu/>
            {this.renderNavs()}
            <switch className={'admin-con'}>
                <Route path="/admin/course-category" exact={true} render={courseCagetory}/>
                <Route path="/admin/courseware-category" exact={true} render={coursewareCagetory}/>
                <Route path="/admin/video-category" exact={true} render={videoCagetory}/>
                <Route path="/admin/question-category" exact={true} render={questionCagetory}/>
                <Route path="/admin/target-category" exact={true} render={targetCagetory}/>
                <Route path="/admin/courseware" exact={true} component={CoursewareList}/>
                <Route path="/admin/video" exact={true} component={VideoList}/>
                <Route path="/admin/question" exact={true} component={QuestionList}/>
                <Route path="/admin/target" exact={true} component={TargetList}/>
                <Route path="/login" exact={true} component={AdminLogin}/>
                <Route path="/" exact={true} render={() => <Redirect to="/admin/course-category"/>}/>
            </switch>
        </div>
    }
}

