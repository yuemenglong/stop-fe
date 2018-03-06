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
import {LeftSideClass} from "../component/LeftSide/index";
import {_adminLeftCon} from "../common/common-method";
import '../common/style.less';

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
        return <div className={'common-left-side'}>
            <LeftSideClass cons={_adminLeftCon}/>
        </div>
    }

    onLogout() {
        ajaxGet(`/admin/logout`, () => {
            location.href = `/login`
        })
    }

    render() {
        let courseCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="course"
                                                      title='课程'/>;
        let coursewareCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="courseware"
                                                          title='课件'/>;
        let videoCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="video"
                                                     title='视频'/>;
        let questionCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="question"
                                                        title='问题'/>;
        let targetCagetory = (props) => <CategoryList history={props.history} match={props.match} ty="target"
                                                      title='靶场'/>;
        return <div className="container common-container">
            <HeadMenu onLogout={this.onLogout.bind(this)} logo={'管理员攻防平台'}/>
            {this.renderNavs()}
            <switch className={'common-right-con'}>
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

