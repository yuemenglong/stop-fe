import * as React from "react";
import {Component} from "react";
import {Route, RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {UserStudyJobList} from "./UserJobList/index";
import {UserStudyJob} from "./UserJob/index";
import {UserStudyJobItem} from "./UserJobItem/index";
import {UserTeam} from "./Team/index";
import {UserTeamJoin} from "./TeamJoin/index";
import {UserTeamInit} from "./TeamInit/index";
import {UserLogin} from "./UserLogin/index";
import {JVOID0} from "../def/data";
import {ajaxGet} from "../common/kit";
import {UserHome} from "./UserHome/index";
import {QuizJobRouter} from "./QuizJob/index";
import {CoursewareList} from "./CoursewareList/index";
import {VideoList} from "./VideoList/index";
import {UserTargetList} from "./UserTarget/index";
import {HeadMenu} from "../component/HeadMenu/index";
import "../common/style.less";
import {LeftSideClass} from "../component/LeftSide/index";
import {_userLeftCon} from "../common/common-method";

export class UserApp extends Component {
    getUid() {
        let m = location.pathname.match(/^\/user\/(\d+).*$/);
        if (!m) {
            return;
        }
        return m[1];
    }

    renderNavs() {
        let uid = this.getUid();
        let logout = () => {
            ajaxGet(`/user/logout`, () => {
                location.href = `/login`
            })
        };
        if (uid) {
            return <div>
                <Link to={`/user/${uid}/target`}>靶场</Link>
                <Link to={`/user/${uid}/courseware`}>查看课件</Link>
                <Link to={`/user/${uid}/video`}>查看视频</Link>
                <Link to={`/user/${uid}/team`}>查看队伍</Link>
                <Link to={`/user/${uid}/study-job`}>学习任务</Link>
                <Link to={`/user/${uid}/quiz-job`}>考试任务</Link>
                <a href={JVOID0} onClick={logout}>注销</a>
            </div>
        } else {
            return null;
        }
    }

    renderNewNavs() {
        let uid = this.getUid();
        return !uid ? null : <div className={'common-left-side'}>
            <LeftSideClass cons={_userLeftCon(uid)}/>
        </div>
    }

    render() {
        return <div className="container common-container">
            {/*{this.renderNavs()}*/}
            <HeadMenu/>
            {this.renderNewNavs()}
            <switch className={'common-right-con'}>
                <Route path="/user/:uid" exact={true} component={UserHome}/>
                <Route path="/user/:uid/courseware" exact={true} component={CoursewareList}/>
                <Route path="/user/:uid/video" exact={true} component={VideoList}/>
                <Route path="/user/:uid/quiz-job" component={QuizJobRouter}/>
                <Route path="/user/:uid/study-job" exact={true} component={UserStudyJobList}/>
                <Route path="/user/:uid/study-job/:jid" exact={true} component={UserStudyJob}/>
                <Route path="/user/:uid/study-job/:jid/item/:id" exact={true} component={UserStudyJobItem}/>
                <Route path="/user/:uid/team" exact={true} component={UserTeam}/>
                <Route path="/user/:uid/team/init" component={UserTeamInit}/>
                <Route path="/user/:uid/team/join" component={UserTeamJoin}/>
                <Route path="/user/:uid/target" component={UserTargetList}/>
                <Route path="/login" component={UserLogin}/>
                <Route path="/" exact={true} component={UserLogin}/>
            </switch>
        </div>
    }
}

